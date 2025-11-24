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

const getAllCoupons = async() => {
    const couponDetails = await couponModel.find({}).select("-_id");

    const resultData = await Promise.all(couponDetails.map(async(coupon) => {
        return {...coupon._doc}
    }))

    return { resultData };
}

const bestCoupon = async (data) => {
    const couponDetails = await getAllCoupons();

    const date = new Date();
    const cartDetails = data.cart.items;

    let cartValue = 0;
    let itemsCount = 0;
    let categories = [];

    for (const item of cartDetails) {
        cartValue += item.unitPrice * item.quantity;
        itemsCount += item.quantity;
        categories.push(item.category);
    }

    let best = null; 

    for (const coupon of couponDetails.resultData) {
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        if (date < startDate || date > endDate) continue;
        if (data.user.ordersPlaced < coupon.eligibility.user.minOrdersPlaced) continue;
        if (!coupon.eligibility.user.allowedCountries.includes(data.user.country)) continue;
        if (!coupon.eligibility.user.allowedUserTiers.includes(data.user.userTier)) continue;
        if (data.user.lifetimeSpend < coupon.eligibility.user.minLifetimeSpend) continue;
        if (coupon.eligibility.user.firstOrderOnly && data.user.ordersPlaced > 0) continue;
        if (cartValue < coupon.eligibility.cart.minCartValue) continue;
        if (itemsCount < coupon.eligibility.cart.minItemsCount) continue;

        const allMatch = categories.every(category =>
            coupon.eligibility.cart.applicableCategories.includes(category)
        );
        if (!allMatch) continue;

        let discount = 0;

        if (coupon.discountType === "FLAT") {
            discount = coupon.discountValue;  // flat discount
        } else if (coupon.discountType === "PERCENT") {
            discount = (cartValue * coupon.discountValue) / 100;

            if (coupon.maxDiscountAmount)
                discount = Math.min(discount, coupon.maxDiscountAmount);
        }

        if (discount <= 0) continue;

        if (best === null) {
            best = { code: coupon.code, discount, endDate };
        } else {
            if (discount > best.discount) {
                best = { code: coupon.code, discount, endDate };
            } else if (discount === best.discount) {
                if (endDate < best.endDate) {
                    best = { code: coupon.code, discount, endDate };
                } 
                else if (endDate.getTime() === best.endDate.getTime() &&
                         coupon.code < best.code) {
                    best = { code: coupon.code, discount, endDate };
                }
            }
        }
    }

    if (!best) {
        return { bestCoupon: null };
    }

    return {
        bestCoupon: {
            code: best.code,
            discount: best.discount
        }
    };
};

module.exports = { addCoupon, bestCoupon };