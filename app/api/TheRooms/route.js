import { NextResponse } from "next/server";
import MongoDBConnect from "../libs/mongodb"
import Roomschema from "../models/Roomschema"


export async function GET(){
    await MongoDBConnect();
    const room = await Roomschema.find().lean();
    return NextResponse.json(room)
}

export async function POST(req){
    const {imageUrl, name, type,description, capacity, prix}= await req.json();
    await MongoDBConnect();
    await Roomschema.create({imageUrl, name, type,description, capacity, prix})
    return NextResponse.json({message:"Room Created "},{status:201})
}