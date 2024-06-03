require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());
const User = require("./Models/UserSchema");
const RoomsSch = require("./Models/hotelSchema");
const ContactSchema = require('./Models/ContactSchema');
const BookingSchema = require('./Models/BookingSchema');
const CheckoutShema = require('./Models/CheckoutShema');
const AdminSchema = require('./Models/AdminSchema');
const PORT = process.env.PORT || 4444;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors = require("cors");
const cloudinary = require("./utils/cloudinary");
const upload = require("./middleware/multer");
const nodemailer = require("nodemailer")

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
mongoose.connect("mongodb+srv://edaoudiEdhotel:IqHpjXDkyHrFQzVe@cluster0.rzchldc.mongodb.net/")
  // mongoose.connect("mongodb://127.0.0.1:27017/auth")
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
app.get("/users", async (req, res) => {
  const users = await User.find().select("-pass").lean();
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);

}
)


//Register
app.post('/register', async (req, res) => {
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
app.post("/login", async (req, res) => {
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
app.post('/Adminregister', async (req, res) => {
  const { name, email, pass } = req.body;
  if (!name || !email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await AdminSchema.findOne({ email }).exec();
  if (foundUser) {
    return res.status(401).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(pass, 10);

  const user = await new AdminSchema({
    name,
    email,
    pass: hashedPassword,
  });
  await user.save();
  const accessTokenAdmin = jwt.sign(
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
    accessToken: accessTokenAdmin,
    email: user.email,
    name: user.name,
  });
})

// login 
app.post("/Adminlogin", async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await AdminSchema.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(pass, foundUser.pass);

  if (!match) return res.status(401).json({ message: "Wrong Password" });

  const accessTokenAdmin = jwt.sign(
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
    accessToken: accessTokenAdmin,
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
app.get('/Rooms', async (req, res) => {
  try {
    const Rooms = await RoomsSch.find();
    res.json(Rooms)

  } catch (error) {
    res.json(error)
  }

})
//  ajouter nouveau Rooms
app.post('/Rooms', upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const { name, type, description, capacity, prix } = req.body;
    const nRooms = new RoomsSch({
      imageUrl: result.secure_url,
      name,
      type,
      description,
      capacity,
      prix
    });
    const Rooms = await nRooms.save();
    res.status(200).json(Rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message
    });
  }
});
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
app.get('/Rooms/:id', async (req, res) => {
  try {
    const Rooms = await RoomsSch.findById({ _id: req.params.id });
    res.json(Rooms)

  } catch (error) {
    res.json(error)
  }

})

app.put('/Rooms/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, type, description, capacity, prix } = req.body;
    if (!name || !type || !description || !capacity || !prix) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    let updatedRoomData = {
      name,
      type,
      description,
      capacity,
      prix
    };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedRoomData.imageUrl = result.secure_url;
    }
    const uRooms = await RoomsSch.findByIdAndUpdate(
      { _id: req.params.id },
      updatedRoomData,
      { new: true }
    );
    if (!uRooms) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: uRooms
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating room",
      error: error.message
    });
  }
});


// delete Rooms
app.delete('/Rooms/:id', async (req, res) => {
  try {
    const dRooms = await RoomsSch.findByIdAndDelete({ _id: req.params.id });
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
app.get('/Contact', async (req, res) => {
  try {
    const Contact = await ContactSchema.find();
    res.json(Contact)

  } catch (error) {
    res.json(error)
  }

})
//  get Contact by Id
app.get('/Contact/:id', async (req, res) => {
  try {
    const Contact = await ContactSchema.findById({ _id: req.params.id });
    res.json(Contact)

  } catch (error) {
    res.json(error)
  }

})
//  ajouter nouveau Rooms
app.post('/Contact', async (req, res) => {
  try {
    const { name, email, subject, msg } = req.body;
    const FindContact = await ContactSchema.findOne({ name, email, subject, msg });
    if (FindContact) {
      return res.status(400).json({ error: 'Contact already exists' });
    }
    const newContact = new ContactSchema({ name, email, subject, msg });
    const savedContact = await newContact.save();
    res.json(savedContact);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete("/Contact", async (req, res) => {
  try {
    await ContactSchema.deleteMany({})
    res.json({ message: "All documents deleted successfully" });
  } catch (error) {
    res.json(error);
  }
});
// ajout doc Checkout
app.post("/ContactDoc", async (req, res) => {
  try {
    const documents = req.body;
    const result = await ContactSchema.insertMany(documents);
    res.json({ message: `${result.length} documents inserted successfully` });
  } catch (error) {
    res.json(error);
  }
});

// delete Rooms
app.delete('/Contact/:id', async (req, res) => {
  try {
    const dContact = await ContactSchema.findByIdAndDelete({ _id: req.params.id });
    res.json(dContact)

  } catch (error) {
    res.json(error)
  }
})

///// BOKING \\\\\\
app.get('/Booking', async (req, res) => {
  try {
    const Booking = await BookingSchema.find();
    res.json(Booking)
  } catch (error) {
    res.json(error)
  }
})

app.get('/Booking/:id', async (req, res) => {
  try {
    const Booking = await BookingSchema.findById({ _id: req.params.id });
    res.json(Booking)
  } catch (error) {
    res.json(error)
  }

})
//  ajouter nouveau Booking
app.post('/Booking', async (req, res) => {

  try {
    const { nameC, email, nameR, prix, check_in, check_out } = req.body;
    const datenew = new Date();
    if (check_in < datenew || check_out < datenew) {
      return res.status(400).json({ message: "date is invalid" });
    }

    const nBooking = new BookingSchema({ nameC, email, nameR, prix, check_in, check_out });
    const Booking = await nBooking.save();
    res.json(Booking);
  } catch (error) {
    res.json(error)
  }

})
// update Booking
app.put('/Booking/:id', async (req, res) => {
  try {
    const { nameC, email, nameR, prix, check_in, check_out } = req.body;
    const uBooking = await BookingSchema.findByIdAndUpdate({ _id: req.params.id },
      { nameC, email, nameR, prix, check_in, check_out }, { new: true });
    res.json(uBooking)
  } catch (error) {
    res.json(error)
  }

})
app.delete('/Booking/:id', async (req, res) => {
  try {
    const dBooking = await BookingSchema.findByIdAndDelete({ _id: req.params.id });
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
app.get('/Bookingpay', async (req, res) => {
  try {
    const { bookings } = req.body;
    const Booking = await BookingSchema.find({ _id: { $in: bookings } });
    res.json(Booking)
  } catch (error) {
    res.json(error)
  }
})
///// paying \\\\\\
app.get('/Checkout', async (req, res) => {
  try {
    const Checkout = await CheckoutShema.find();
    res.json(Checkout)
  } catch (error) {
    res.json(error)
  }
})
app.get('/Checkout/:id', async (req, res) => {
  try {
    const Checkout = await CheckoutShema.findById({ _id: req.params.id });
    res.json(Checkout)
  } catch (error) {
    res.json(error)
  }

})
//  ajouter nouveau Checkout
app.post('/Checkout', async (req, res) => {

  try {
    const { nameC, email, nameR, amount, check_in, check_out } = req.body;
    const nCheckout = new CheckoutShema({ nameC, email, nameR, amount, check_in, check_out });
    const Checkout = await nCheckout.save();
    res.json(Checkout);
  } catch (error) {
    res.json(error)
  }

})
// update Checkout
app.put('/Checkout/:id', async (req, res) => {
  try {
    const { nameC, email, nameR, amount, check_in, check_out } = req.body;
    const uCheckout = await CheckoutShema.findByIdAndUpdate({ _id: req.params.id },
      { nameC, email, nameR, amount, check_in, check_out }, { new: true });
    res.json(uCheckout)
  } catch (error) {
    res.json(error)
  }
})
app.delete('/Checkout/:id', async (req, res) => {
  try {
    const dCheckout = await CheckoutShema.findByIdAndDelete({ _id: req.params.id });
    res.json(dCheckout)

  } catch (error) {
    res.json(error)
  }
})
app.delete("/Checkoutd", async (req, res) => {
  try {
    await CheckoutShema.deleteMany({})
    res.json({ message: "All documents deleted successfully" });
  } catch (error) {
    res.json(error);
  }
});

app.delete("/CheckoutAll", async (req, res) => {
  try {
    const { Checkouts } = req.body;
    await BookingSchema.deleteMany({ _id: { $in: Checkouts } });
    res.json({ message: "Selected documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting documents" });
  }
});
app.get('/Checkoutpay', async (req, res) => {
  try {
    const { Checkouts } = req.body;
    const Checkout = await BookingSchema.find({ _id: { $in: Checkouts } });
    res.json(Checkout)
  } catch (error) {
    res.json(error)
  }
})
// ajout doc Checkout
app.post("/CheckoutDoc", async (req, res) => {
  try {
    const documents = req.body;
    const result = await CheckoutShema.insertMany(documents);
    res.json({ message: `${result.length} documents inserted successfully` });
  } catch (error) {
    res.json(error);
  }
});

// SEND EMAIL

app.post('/SendEmail', async (req, res) => {
  const { to, subject, html } = req.body;

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: 'abdellahedaoudi80@gmail.com',
      pass: 'ydfbzevdjnljtcnp'
    }
  });

  // Setup email data
  const mailOptions = {
    from: 'abdellahedaoudi80@gmail.com', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html // plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email: %s', error);
    res.json({ message: 'Error sending email', error });
  }
});

app.post('/SendEmailAll', async (req, res) => {
  const { to, subject, html } = req.body;

  // Ensure 'to' is an array (in case of multiple emails)
  const toEmails = Array.isArray(to) ? to : [to];

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: 'abdellahedaoudi80@gmail.com',
      pass: 'ydfbzevdjnljtcnp'
    }
  });

  // Setup email data
  const mailOptions = {
    from: 'abdellahedaoudi80@gmail.com', // sender address
    to: toEmails.join(', '), // list of receivers as comma-separated string
    subject: subject, // Subject line
    html: html // HTML body
  };

  // Send mail with defined transport object
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email: %s', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
});
