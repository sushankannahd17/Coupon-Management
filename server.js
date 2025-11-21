const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./src/app");

const uri = "mongodb+srv://admin:fOUJKDBWtuR9Meqr@cluster0.ocp2umb.mongodb.net/coupons?appName=Cluster0"

mongoose.connect(uri)
.then(() => {
    console.log("MongoDB Connected");
})

const app = express();

app.use(express.json())
app.use("/api", appRouter);

app.listen(3001);