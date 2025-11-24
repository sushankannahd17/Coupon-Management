const { body, validationResult } = require("express-validator")
const coupons = require("../service/coupon")

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).send({ message: errorArray[0].msg });
    }

    next();
}

const addCoupon = [
    body("code")
        .toUpperCase()
        .trim()
        .notEmpty()
        .withMessage("Enter the code"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Enter the description"),
    body("discountType")
        .toUpperCase()
        .trim()
        .isIn(["FLAT", "PERCENT"]).withMessage("Type of Discount should be either FLAT OR PERCENT"),
    body("discountValue")
        .isNumeric().withMessage("The discount value should be a number")
        .toFloat(),
    body("maxDiscountAmount")
        .optional()
        .isNumeric().withMessage("The max discount value should be a number"),
    body("startDate")
        .notEmpty().withMessage("Enter the start date")
        .isISO8601().withMessage("The date should be valid")
        .toDate(),
    body("endDate")
        .notEmpty().withMessage("Enter the end date")
        .isISO8601().withMessage("The date should be valid")
        .toDate()
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error("End date should be after start date")
            }
            return true
        }),
    body("usageLimitPerUser")
        .optional()
        .isNumeric().withMessage("The usage limit should be a number")
        .toInt()
];

module.exports = { addCoupon, validate };