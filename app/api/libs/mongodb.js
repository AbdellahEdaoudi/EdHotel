
import mongoose from "mongoose";

const MongoDBConnect = () =>{
    try {
        mongoose.connect("mongodb+srv://edaoudiEdhotel:IqHpjXDkyHrFQzVe@cluster0.rzchldc.mongodb.net/");
        console.log("Connected next to MongoDb Atlas");
    } catch (error) {
        console.log(error);
    }
}
export default MongoDBConnect ;