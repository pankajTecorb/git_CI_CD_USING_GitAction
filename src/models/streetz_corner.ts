import { Schema, model } from 'mongoose';
interface streetz_corner {
    userId: String;
    title: String;
    public:boolean;
    private:boolean;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<streetz_corner>({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    title: {type:String,default:''},
    public:{type:Boolean,default:false},
    private:{type:Boolean,default:false},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});


const streetz_cornerModel = model<streetz_corner>('streetz_corners', schema);
export = streetz_cornerModel;
