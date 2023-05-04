import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userPostController from '@controllers/user/posts';
import { success } from '@constants';
import { verifyAuthToken } from "@utils/authValidator";


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    createPost:'/createPost',
    getPosts:'/getPosts',
    getPostDetails:'/getPostDetails',
    getUserPosts:'/getUserPosts',
    userFollow:'/followUnfollow',
} as const;

/**
 * Create post
 */
router.post(p.createPost, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userPostController.createPost(req.body,req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

/**
 * Get posts
 */
router.post(p.getPosts, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userPostController.getPosts(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

/** 
 * Get post details
 */
router.post(p.getPostDetails, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userPostController.getPostDetails(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

/**
 * Get user post
 */
router.post(p.getUserPosts, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userPostController.getUserPosts(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});
//**********User  Follow *********** */
router.post(p.userFollow, verifyAuthToken,  async (req: any, res: Response) => {
    const data = await userPostController.followUnfollow(req.body,req.user.id);
    return res.status(OK).send({data, code: OK ,message: success.en.success})
});
// Export default
export default router;