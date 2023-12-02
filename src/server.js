import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 5000;

mongoose.connect()



app.listen(port, () => {
    console.log(`API server is running  on port ${port}`)
});
