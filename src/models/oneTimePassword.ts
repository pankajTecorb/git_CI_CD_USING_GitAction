import { Schema, model } from 'mongoose';

interface otp {
    pin: string;
    pinExpiry: number;
    userId: String,
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<otp>({
    pin: { type: String, required: true },
    userId: { type: String, required: true },
    pinExpiry: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
});

const otpModel = model<otp>('otp', schema);
export = otpModel