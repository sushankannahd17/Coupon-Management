const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./src/app");
require("dotenv").config()

const uri = ""

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})

const app = express();

app.use(express.json())
app.use("/api", appRouter);

app.listen(process.env.PORT);