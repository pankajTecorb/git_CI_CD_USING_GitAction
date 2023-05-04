import { userModel, otpModel, userSessionModel, addressModel,postModel, streetz_cornerModel } from '@models/index';
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
 * Create Streetz corner
 * 
 * @param Streetz corner 
 * @returns 
 */

// Add Streetz_corner
function addStreetz_corner(data:any, userId:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !userId) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                data.userId = userId;
                const streetz_cornerData: any = await streetz_cornerModel.create(data);
                resolve(streetz_cornerData);
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

// User List Streetz_corner
function UserStreetz_cornerList(data:any,userId:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            var pageNo = data.pageNo ? data.pageNo : 1;
            var perPage = data.perPage ? data.perPage : 10;
            const streetz_corner:any = await streetz_cornerModel.find({'userId':userId,'isActive':true,'isDelete':false}).skip(perPage*(pageNo-1)).limit(perPage);
            const streetz_cornerCount:any = await streetz_cornerModel.countDocuments({'userId':userId,'isActive':true,'isDelete':false});
            resolve({result:streetz_corner,count:streetz_cornerCount});
        }catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// User Streetz corner list based on filter private/public
function UserStreetz_cornerFilter(data:any,userId:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            var pageNo = data.pageNo ? data.pageNo : 1;
            var perPage = data.perPage ? data.perPage : 10;
            const obj:any = {
                'userId':userId,
                'isActive':true,
                'isDelete':false
            };
            if(data.private == true){
                obj.private = true;
            }

            if(data.public == true){
                obj.public = true;
            }
            const streetz_corner:any = await streetz_cornerModel.find(obj).skip(perPage*(pageNo-1)).limit(perPage);
            const streetz_cornerCount:any = await streetz_cornerModel.countDocuments(obj);
            resolve({result:streetz_corner,count:streetz_cornerCount});
        }catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}



// Export default
export default {
    addStreetz_corner,
    UserStreetz_cornerList,
    UserStreetz_cornerFilter
} as const;