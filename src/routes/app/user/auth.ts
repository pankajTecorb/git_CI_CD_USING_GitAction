import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userAuthController from '@controllers/user/auth';
import { success } from '@constants';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema, logInSchema, accountVerificationSchema, sendOtpSchema, verifyOtpSchema,address} from "@validators/auth"
import { verifyAuthToken } from "@utils/authValidator";


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/login',
    signUp: '/sign-up',
    check: '/check-account',
    sendOtp:'/sendOtp',
    verifyOpt:'/verifyOtp',
    address:'/address',
    addressEdit:'/addressEdit',
    ChangePassword:'/ChangePassword',
    GetUserAddress:'/GetUserAddress',
    ResetPassword:'/ResetPassword',
    get: '/get',
    update: '/update'
} as const;

/**
 * User SignUp
 */
router.post(p.signUp,  schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.signUp(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.signupSuccessful});
});

/**
 * Mark account Verified
 */
router.post(p.check,  schemaValidator(accountVerificationSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.checkAccount(req.body);
    return res.status(OK).send({ data, code: OK, message: data.isUser ? success.en.accountExists: success.en.noSuchAccountExist });
});

/**
 * User Login
 */
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.login(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.loginSuccessful });
});
//send Otp
router.post(p.sendOtp, schemaValidator(sendOtpSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.sendOtp(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
//Verify Otp
router.post(p.verifyOpt, schemaValidator(verifyOtpSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.verifyOtp(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
//Add Address
router.post(p.address , verifyAuthToken, schemaValidator(address),async (req: any, res: Response) => {
    const data = await userAuthController.addAddress(req.body , req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
//Edit Address
router.post(p.addressEdit , verifyAuthToken,async (req: any, res: Response) => {
    const data = await userAuthController.addAddress(req.body , req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
//Get User Address
router.post(p.GetUserAddress , verifyAuthToken,async (req: any, res: Response) => {
    const data = await userAuthController.GetUserAddress(req.body , req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

//Change password
router.post(p.ChangePassword, verifyAuthToken,async (req: any, res: Response) => {
    const data = await userAuthController.ChangePassword(req.body , req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

//Reset password
router.post(p.ResetPassword, async (req: any, res: Response) => {
    const data = await userAuthController.ResetPassword(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
//**********Get Profile****** */
router.get(p.get, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userAuthController.getProfile(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});
//**********Update Profile****** */
router.put(p.update, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userAuthController.updateProfile(req.body, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});
// Export default
export default router;
