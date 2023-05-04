import { userModel, otpModel, userSessionModel, addressModel,postModel ,followFolloweeModel} from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import { randomNumber, getEpochAfterNSeconds } from "@utils/helpers";
import bcrypt from 'bcrypt';
import { resolve } from 'path';
import { reject } from 'promise';
//import { toLower } from 'lodash';
const _ = require('lodash');

/**
 * Create post
 * 
 * @param post 
 * @returns 
 */

function createPost(data:any, userId:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.desc) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                data.userId = userId;
                const postData: any = await postModel.create(data);
                resolve(postData);
            }
        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// Get All Posts
function getPosts(data:any,userId:any):Promise<any>{
    return new Promise(async (resolve,reject) =>{
        try{
            var pageNo = data.pageNo ? data.pageNo : 1;
            var perPage = data.perPage ? data.perPage : 10;

            if (!userId) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                const posts:any = await postModel.find({'isActive':true,'isDelete':false}).populate({path:'userId'}).sort({'createdAt':-1}).skip(perPage*(pageNo-1)).limit(perPage);
                const postCount:any = await postModel.countDocuments({'isActive':true,'isDelete':false});
                resolve({posts:posts,count:postCount});
            }
        }catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// Get Post Details
function getPostDetails(data:any,userId:any):Promise<any>{
    return new Promise(async (resolve,reject) =>{
        try{
            if (!userId || !data.postId) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                const postDetails:any = await postModel.findOne({'_id':data.postId,'isActive':true,'isDelete':false});
                resolve(postDetails);
            }
        }catch(err){
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// Get User Posts
function getUserPosts(data:any,userId:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            var pageNo = data.pageNo ? data.pageNo : 1;
            var perPage = data.perPage ? data.perPage : 10;
            if(!userId){
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            }

            const userPosts: any = await postModel.find({'userId':userId,'isActive':true,'isDelete':false});
            const userPostCount:any = await postModel.countDocuments({'userId':userId,'isActive':true,'isDelete':false});
            resolve({posts:userPosts,count:userPostCount});
        }catch(err){
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

//***********Add Follower *********/
function followUnfollow(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { followeeId, action } = body
            const followData = await followFolloweeModel.findOne({ followeeId: followeeId, followerId: userId }, { _id: 1 })
            if (action == "follow") {
                if (followData) {
                    reject(new CustomError(errors.en.alreadyFollow, StatusCodes.BAD_REQUEST))
                } else {
                    body = {
                        ...body,
                        followerId: userId
                    }
                    await followFolloweeModel.create(body)
                    resolve({ success: true })
                }
            } else {
                if (!followData) {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                } else {
                    await followFolloweeModel.deleteOne({ _id: followData._id });
                    resolve({ success: true })
                }
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.alreadyExist, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}
// Export default
export default {
    createPost,
    getPosts,
    getPostDetails,
    getUserPosts,
    followUnfollow
} as const;