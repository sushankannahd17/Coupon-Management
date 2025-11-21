const couponModel = require("../models/coupon");

const addCoupon = async (data) => {
    const {code, description, discountType, discountValue, maxDiscountAmount, startDate, endDate, usageLimitPerUser, eligibility} = data;
    const existingCoupon = await couponModel.findOne({
        code: code, 
    });

    if (existingCoupon) {
        throw new Error("Coupon Already Exists");
    }

    const newCoupon = await couponModel({
        code: code, 
        description: description,
        discountType: discountType, 
        discountValue: discountValue, 
        maxDiscountAmount: maxDiscountAmount, 
        startDate: startDate, 
        endDate: endDate, 
        usageLimitPerUser: usageLimitPerUser, 
        eligibility: eligibility
    })

    const saved = await newCoupon.save();
    return {couponId: saved._id.toString()};
}

module.exports = { addCoupon };