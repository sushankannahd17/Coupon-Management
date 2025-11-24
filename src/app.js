const express = require("express");
const router = express.Router();

const coupon_router = require("./router/coupon");

router.use("/coupons", coupon_router);

module.exports = router;