import { userModel, otpModel, userSessionModel, addressModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import { randomNumber, getEpochAfterNSeconds } from "@utils/helpers";
import bcrypt from 'bcrypt';
//import { toLower } from 'lodash';
const _ = require('lodash');

/**
 * user SignUp
 * 
 * @param user 
 * @returns 
 */
function signUp(user: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { role = "User", email } = user
            const exitData: any = await userModel.findOne({ email: email })
            if (exitData) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST))
            } else {
                const pass = bcrypt.hashSync(user.password, 10);
                user.password = pass
                user.role = role
                const userData: any = await userModel.create(user)
                const token: string = jwt.sign({
                    id: userData.id,
                    role,
                    userId: userData._id
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })

                resolve({
                    token,
                    name: userData.name,
                    email: userData.email,
                    _id: userData._id
                })
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

/**
 * user signIn.
 * @returns 
 */
function login(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password, role = "User" } = body;
            const userData: any = await userModel.findOne({ email })
            var match = bcrypt.compareSync(password, userData.password);
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            } else if (userData.isActive == false) {
                reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
            } else if (match == false) {
                reject(new CustomError(errors.en.WrongPassword, StatusCodes.BAD_REQUEST))
            } else {
                const token: string = jwt.sign({
                    id: userData.id,
                    role
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                await userModel.updateOne(
                    { _id: userData._id },
                    { lastLoginAt: getEpochAfterNSeconds(0) }
                );
                const sessionObj = {
                    jwtToken: token,
                    userId: userData._id,
                    role: "User",
                };
                await userSessionModel.updateOne(
                    { userId: userData.id },
                    { $set: sessionObj }, { upsert: true }
                );

                resolve({
                    token,
                    name: userData.name,
                    email: userData.email,
                    _id: userData._id
                })
            }

        } catch (err) {
            reject(err)
        }
    });
}

/**
 * user Account verification
 * 
 * @param user 
 * @returns 
 */
function checkAccount(user: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, role = "User" } = user;
            const userData: any = await userModel.findOne({
                email,
                role
            })
            if (!userData) {
                resolve({
                    isUser: false,

                })
            } else {
                if (userData.isActive) {
                    resolve({
                        isUser: true,
                    })
                } else {
                    reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
                }
            }
        } catch (err) {
            reject(err)
        }
    });
}
// send otp
function sendOtp(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email } = body;
            const userData: any = await userModel.findOne({ email: email })
            if (userData) {
                const pin = randomNumber();
                const time = getEpochAfterNSeconds(0) + 120
                await otpModel.updateOne(
                    { userId: userData._id },
                    { pin, pinExpiry: time },
                    { upsert: true }
                );
                resolve({
                    otpSend: true,
                });
            } else {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err);
            reject(
                new CustomError(errors.en.errorInSendingOtp, StatusCodes.UNAUTHORIZED)
            );
        }
    });
}
//verify otp
function verifyOtp(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = getEpochAfterNSeconds(0);
            const { pin, email } = body;
            const userData: any = await userModel.findOne({ email: email })
            if (userData) {
                const pinObj: any = await otpModel.findOne({
                    userId: userData._id,
                    pinExpiry: { $gte: currentTime },
                });
                if (pinObj) {
                    if (currentTime <= pinObj.pinExpiry) {
                        if (pin == 1234) {
                            await otpModel.deleteOne({ _id: pinObj._id });
                            await userModel.updateOne(
                                {
                                    _id: userData._id,
                                    isDelete: false
                                },
                                { lastLoginAt: getEpochAfterNSeconds(0) }
                            );
                            resolve({
                                otpVerified: true,
                            });
                        } else {
                            reject(
                                new CustomError(errors.en.incorrectPin, StatusCodes.BAD_REQUEST)
                            );
                        }
                    } else {
                        reject(
                            new CustomError(errors.en.pinExpired, StatusCodes.BAD_REQUEST)
                        );
                    }
                } else {
                    reject(new CustomError(errors.en.pinExpired, StatusCodes.BAD_REQUEST));
                }
            } else {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            reject(err);
        }
    });
}

//Add address
function addAddress(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { state, city, lat, long, type, addressId } = body
            if (type == "Add") {
                const lowerState = (body.state).toLowerCase();
                const lowerCity = (body.city).toLowerCase();
                const exitData: any = await addressModel.findOne({ userId: userId, state: lowerState, city: lowerCity })
                if (exitData) {
                    reject(new CustomError(errors.en.userAddressExist, StatusCodes.BAD_REQUEST))
                } else {
                    const editdata = {
                        ...body,
                        userId: userId,
                        state: lowerState.trim(),
                        city: lowerCity.trim()
                    }
                    const addData = await addressModel.create(editdata)
                    resolve({ addData })
                }
            } else {
                const addressData: any = await addressModel.findOne({ _id: addressId, userId: userId })
                if (addressData) {
                    await addressModel.updateMany(
                        { userId: userId },
                        { $set: { isPrimary: false } });
                    const editData = await addressModel.updateOne(
                        { _id: addressId, userId: userId },
                        { $set: { isPrimary: true } }
                    );
                    resolve({ editData })
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

// Change password
function ChangePassword(user: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user.password || !userId) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                const pass = bcrypt.hashSync(user.password, 10);
                const updatePass = await userModel.updateOne({ '_id': userId }, { 'password': pass });
                resolve(updatePass);
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

// Get User address
function GetUserAddress(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNo = body.pageNo ? body.pageNo : 1;
            const perPage = body.perPage ? body.perPage : 10;
            if (!userId) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            }

            const userAddress: any = await addressModel.find({ 'userId': userId, 'isActive': true, 'isDelete': false });
            const userAddressCount: any = await addressModel.countDocuments({ 'userId': userId, 'isActive': true, 'isDelete': false });
            resolve({ 'address': userAddress, count: userAddressCount });
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err)
        }
    });
}

// Reset password
function ResetPassword(user: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user.password || !user.email) {
                reject(new CustomError(errors.en.invalidAction, StatusCodes.BAD_REQUEST));
            } else {
                const pass = bcrypt.hashSync(user.password, 10);
                const usr: any = await userModel.findOne({ 'email': user.email, 'isActive': true, 'isDelete': false });
                if (usr) {
                    const updatePass = await userModel.updateOne({ 'email': user.email, 'isActive': true, 'isDelete': false }, { password: pass });
                    resolve(updatePass);
                } else {
                    reject(new CustomError(errors.en.noSuchAccount, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userWithSameEmail, StatusCodes.BAD_REQUEST));
            }
            reject(err)
        }
    });
}

//**********Get Profile****** */
function getProfile(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await userModel.findOne({ _id: userId },{"createdAt":0 ,updatedAt:0 ,lastLoginAt:0,password:0,isActive:0,isDelete:0})
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
            console.log(err);
            reject(err)
        }
    });
}
//*********** update Profile  *********/
function updateProfile(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId });
            if (!userData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                // if (file) {
                //     body = {
                //         ...body,
                //         image: file.path
                //     }
                // }
                const userObj = await userModel.updateOne({ _id: userId }, body, { new: true });
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}
// Export default
export default {
    login,
    signUp,
    checkAccount,
    sendOtp,
    verifyOtp,
    addAddress,
    ChangePassword,
    GetUserAddress,
    ResetPassword,
    getProfile,
    updateProfile
} as const;
