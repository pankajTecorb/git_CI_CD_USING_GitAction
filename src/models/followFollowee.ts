import { Schema, model } from 'mongoose';

interface followFollowee {
    followeeId: String;
    followerId:String,
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<followFollowee>({
    followeeId: { type: Schema.Types.ObjectId, ref: 'users', required: true}, //following ID's
    followerId: { type: Schema.Types.ObjectId, ref: 'users', required: true},  //follower ID's
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
});

const followFolloweeModel = model<followFollowee>('followFollowee', schema);
export = followFolloweeModel