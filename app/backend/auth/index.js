require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());
const User = require("../Models/UserSchema");
const RoomsSch = require("../Models/hotelSchema");
const ContactSchema = require('../Models/ContactSchema');
const BookingSchema = require('../Models/BookingSchema');
const PORT = process.env.PORT || 4444;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors = require("cors");
app.use(cors());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://edhotel.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
// VerifyToken middleware
const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.id;
    next();
  });
};


mongoose.set('strictQuery', true);

mongoose.connect(process.env.URL_DATABASE)
  // mongoose.connect("mongodb://127.0.0.1:27017/auth-my-htl-app")
  .then(() => {
    console.log(`Connect to Mongodb Atlas`);
  })
  .catch(err => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Server runing in port ${PORT}`);
});

// Get users
app.get("/users", VerifyToken, async (req, res) => {
  const users = await User.find().select("-pass").lean();
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);

}
)


//Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, pass } = req.body;
  if (!name || !email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (foundUser) {
    return res.status(401).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(pass, 10);

  const user = await new User({
    name,
    email,
    pass: hashedPassword,
  });
  await user.save();
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken,
    email: user.email,
    name: user.name,
  });
})

// login 
app.post("/api/auth/login", async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(pass, foundUser.pass);

  if (!match) return res.status(401).json({ message: "Wrong Password" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60m" }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken,
    email: foundUser.email,
    name: foundUser.name,
  });
});

// refresh
app.get("/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60m" }
      );
      res.json({ accessToken });
    }
  );
});

app.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
});

// hotelSchema

//  get all Rooms
app.get('/Rooms',async(req,res)=>{
  try {
      const Rooms=await RoomsSch.find();
      res.json(Rooms)
      
  } catch (error) {
      res.json(error)
  }

})
//  ajouter nouveau Rooms
app.post('/Rooms',async(req,res)=>{

try {
  const {imageUrl, name, type, capacity, prix} = req.body;
  const nRooms= new RoomsSch({imageUrl, name, type, capacity, prix});
  const Rooms= await nRooms.save();
  res.json(Rooms);
} catch (error) {
  res.json(error)
}

})
// ajout doc ROomse
app.post("/Roomss", async (req, res) => {
  try {
    const documents = req.body;
    const result = await RoomsSch.insertMany(documents);
    res.json({ message: `${result.length} documents inserted successfully` });
  } catch (error) {
    res.json(error);
  }
});
//  get Rooms by Id
app.get('/Rooms/:id',async(req,res)=>{
try {
  const Rooms=await RoomsSch.findById({_id :req.params.id});
  res.json(Rooms)
  
} catch (error) {
  res.json(error)
}

})

// update Rooms
app.put('/Rooms/:id',async(req,res)=>{

try {
  const { imageUrl, name, type, capacity, prix } = req.body;
  const uRooms=await RoomsSch.findByIdAndUpdate({_id:req.params.id},
    { imageUrl, name, type, capacity, prix },{new:true});
  res.json(uRooms)
  
} catch (error) {
  res.json(error)
}

})

// delete Rooms
app.delete('/Rooms/:id',async(req,res)=>{
try {
  const dRooms=await RoomsSch.findByIdAndDelete({_id:req.params.id});
  res.json(dRooms)
  
} catch (error) {
  res.json(error)
}
})

app.delete("/Roomsd", async (req, res) => {
  try {
    await RoomsSch.deleteMany({})
    res.json({ message: "All documents deleted successfully" });
  } catch (error) {
    res.json(error);
  }
});

///// CONTACT \\\\\\
//  get all Contact
app.get('/Contact',async(req,res)=>{
  try {
      const Contact=await ContactSchema.find();
      res.json(Contact)
      
  } catch (error) {
      res.json(error)
  }

})
//  ajouter nouveau Rooms
app.post('/Contact',async(req,res)=>{

try {
  const {name,email,subject,msg} = req.body;
  const nContact= new ContactSchema({name,email,subject,msg});
  const Contact= await nContact.save();
  res.json(Contact);
} catch (error) {
  res.json(error)
}

})
app.delete("/Contact", async (req, res) => {
  try {
    await ContactSchema.deleteMany({})
    res.json({ message: "All documents deleted successfully" });
  } catch (error) {
    res.json(error);
  }
});

///// BOKING \\\\\\
app.get('/Booking',async(req,res)=>{
  try {
      const Booking=await BookingSchema.find();
      res.json(Booking)
  } catch (error) {
      res.json(error)
  }
})
//  ajouter nouveau Booking
app.post('/Booking',async(req,res)=>{

try {
  const {nameC,email,nameR,prix,check_in,check_out} = req.body;
  const datenew = new Date();
  if (check_in< datenew || check_out < datenew ) {
    return res.status(400).json({ message: "date is invalid" });
  }
  
  const nBooking= new BookingSchema({nameC,email,nameR,prix,check_in,check_out});
  const Booking= await nBooking.save();
  res.json(Booking);
} catch (error) {
  res.json(error)
}

})
// update Rooms
app.put('/Booking/:id',async(req,res)=>{
  try {
    const {nameC,email,nameR,prix,check_in,check_out}  = req.body;
    const uBooking=await BookingSchema.findByIdAndUpdate({_id:req.params.id},
      {nameC,email,nameR,prix,check_in,check_out} ,{new:true});
    res.json(uBooking)
  } catch (error) {
    res.json(error)
  }
  
  })
app.delete('/Booking/:id',async(req,res)=>{
  try {
    const dBooking=await BookingSchema.findByIdAndDelete({_id:req.params.id});
    res.json(dBooking)
    
  } catch (error) {
    res.json(error)
  }
  })
app.delete("/Bookingd", async (req, res) => {
  try {
    await BookingSchema.deleteMany({})
    res.json({ message: "All documents deleted successfully" });
  } catch (error) {
    res.json(error);
  }
});

app.delete("/BookingdAll", async (req, res) => {
  try {
    const { bookings } = req.body;
    await BookingSchema.deleteMany({ _id: { $in: bookings } });
    res.json({ message: "Selected documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting documents" });
  }
});


