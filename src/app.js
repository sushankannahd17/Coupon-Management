const express = require("express");
const router = express.Router();

const coupon_router = require("./router/coupon");

router.use("/create_coupon", coupon_router);

module.exports = router;