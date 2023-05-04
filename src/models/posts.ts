import { Schema, model } from 'mongoose';


interface Post {
    userId: String;
    title: String;
    desc: String;
    image:any;
    video:any;
    gif:String;
    lat: String;
    long: String;
    public:boolean;
    private:boolean;
    hash_tag:String;
    tags:String;
    topic:String;
    likeCount:Number;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Post>({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    title: {type:String,default:''},
    desc: {type:String,default:''},
    image:[],
    video:[],
    gif:{type:String,default:''},
    lat: {type:String,default:''},
    long: {type:String,default:''},
    public:{type:Boolean,default:false},
    private:{type:Boolean,default:false},
    hash_tag:{type:String,default:''},
    tags:{type:Schema.Types.ObjectId,ref:'users'},
    topic:{type:Schema.Types.ObjectId,ref:'streetz_corners'},
    likeCount:{type:Number,default:0},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});


const postModel = model<Post>('posts', schema);
export = postModel;
