const mongoose = require("mongoose");
const eligibilitySchema = require("../models/eligibility");

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["FLAT", "PERCENT"],
        required: true
    },
    discountValue: {
        type: Number
    },
    maxDiscountAmount: Number,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    usageLimitPerUser: {
        type: Number,
        required: false
    },
    eligibility: eligibilitySchema
});

module.exports = mongoose.model("Coupon", CouponSchema);