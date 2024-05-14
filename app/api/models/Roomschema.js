import mongoose,{Schema} from "mongoose";

const Roomschema = new Schema(
    {
    imageUrl: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      prix: { 
        type: Number,
        required: true,
      },
    },
      {timestamps:true});

const Rooms = mongoose.model("Rooms", Roomschema);
export default Rooms ; 
