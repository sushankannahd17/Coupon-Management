const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./src/app");
require("dotenv").config();
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})

const app = express();

app.use(cors());
app.use(express.json())
app.use("/api", appRouter);

app.listen(process.env.PORT);