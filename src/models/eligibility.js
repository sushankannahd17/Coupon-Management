const mongoose = require("mongoose");

const userEligibility = new mongoose.Schema({
    allowedUserTiers: [{
        type: String,
        enum: ["NEW", "REGULAR", "GOLD"]
    }],
    minLifetimeSpend: Number,
    minOrdersPlaced: Number,
    firstOrderOnly: {
        type: Boolean,
        default: false
    },
    allowedCountries: [{
        type: String,
        enum: ["IN", "US"]
    }]
})

const cartEligibility = new mongoose.Schema({
    minCartValue: Number,
    applicableCategories: [String],
    excludedCategories: [String],
    minItemsCount: Number
})

const EligibilitySchema = new mongoose.Schema({
    user: userEligibility,
    cart: cartEligibility,
})

module.exports = EligibilitySchema;