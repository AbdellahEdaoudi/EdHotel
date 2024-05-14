
import mongoose from "mongoose";

const MongoDBConnect = () =>{
    try {
        mongoose.connect(process.env.URL_DATABASE);
        console.log("Connected next to MongoDb Atlas");
    } catch (error) {
        console.log(error);
    }
}
export default MongoDBConnect ;