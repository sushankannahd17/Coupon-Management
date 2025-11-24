const couponService = require("../service/coupon");
const moment = require("moment");

const addCoupon = async(req, res) => {
    try {
        const couponId = await couponService.addCoupon(req.body);

        res.status(200).json({
            message: "Coupon Added",
            couponId: couponId
        })
    }
    catch (err) {
        if (err.message == "Coupon Already Exists") {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })
    }
}

const bestCoupon = async (req, res) => {
    try {
        const result = await couponService.bestCoupon(req.body);

        return res.status(200).json(result);
    } 
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { addCoupon, bestCoupon };