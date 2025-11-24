const express = require("express");
const router = express.Router();

const couponController = require("../controller/coupon");
const couponMiddleWare = require("../middleware/coupon");

router.post("/create_coupon", couponMiddleWare.addCoupon, couponMiddleWare.validate, couponController.addCoupon)
router.post("/bestCoupon", couponController.bestCoupon);    

module.exports = router;