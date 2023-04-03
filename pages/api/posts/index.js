// for getting collection of all posts or sending a single post. for deleting a single post refer to [id].js

import { connectToDatabase } from "@/util/mongodb";
import { Timestamp } from "mongodb";

export default async function handler(req, res) {
  const { method, body } = req; // destructure request and access method and body

  const { db } = await connectToDatabase(); //connectToDatabase is async from mongodb.js so need to await

 //fetch data back from database
  if (method === "GET") {
    try {
      const posts = await db
        .collection("posts")
        .find()
        .sort({ timestamp: -1 })
        .toArray(); //fetch all posts from collection. sort by descending timestamp. turn to array
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //send and store post to database
  //we will use api routes on client side. be on form and input and feed pages/components on client side and send request from the client side. This function will check the method and do its work
  if (method === "POST") {
    try {
      const post = await db
        .collection("posts")
        .insertOne({ ...body, timestamp: new Timestamp() });
      res.status(201).json(post); //return json of post. positive status, it is working
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
