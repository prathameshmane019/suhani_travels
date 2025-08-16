"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const passengerDetailsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[\d\s\-\(\)]+$/.test(v);
            },
            message: 'Please provide a valid phone number'
        }
    },
    age: {
        type: Number,
        min: [0, 'Age must be a positive number'],
        required: false
    },
}, { _id: false });
const bookingSchema = new mongoose_1.Schema({
    tripId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Trip",
        required: true,
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    seatNumbers: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one seat must be selected'
        }
    },
    passengerDetails: {
        type: [passengerDetailsSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one passenger detail is required'
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
        default: 'credit_card'
    },
    transactionId: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    boardingPoint: {
        name: { type: String, required: true },
        sequence: { type: Number, required: true },
        _id: false // Turn off default _id for this subdocument
    },
    dropoffPoint: {
        name: { type: String, required: true },
        sequence: { type: Number, required: true },
        //  turn off defualt _id
        _id: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better query performance
bookingSchema.index({ tripId: 1, status: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
// Virtual for getting booking reference number
bookingSchema.virtual('bookingReference').get(function () {
    return `BK${this._id.toString().slice(-8).toUpperCase()}`;
});
// Virtual for getting total passengers
bookingSchema.virtual('totalPassengers').get(function () {
    return this.seatNumbers.length;
});
// Pre-save middleware to ensure data consistency
bookingSchema.pre('save', function (next) {
    // Ensure passenger details count matches seat numbers count.
    if (this.seatNumbers.length !== this.passengerDetails.length) {
        return next(new Error('Number of passengers must match number of selected seats'));
    }
    // Update updatedAt timestamp
    this.updatedAt = new Date();
    next();
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
//# sourceMappingURL=booking.js.map