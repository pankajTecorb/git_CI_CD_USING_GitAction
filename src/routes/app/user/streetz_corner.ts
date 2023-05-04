import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import streetz_cornerController from '@controllers/user/streetz_corner';
import { success } from '@constants';
import { verifyAuthToken } from "@utils/authValidator";


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    addStreetz_corner:'/addStreetz_corner',
    UserStreetz_cornerList:'/UserStreetz_cornerList',
    UserStreetz_cornerFilter:'/UserStreetz_cornerFilter'
} as const;

/**
 * Add Streetz corner
 */
router.post(p.addStreetz_corner, verifyAuthToken, async (req: any, res: Response) => {
    const data = await streetz_cornerController.addStreetz_corner(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

/**
 * Get Streetz corner for user
 */
router.post(p.UserStreetz_cornerList, verifyAuthToken, async (req: any, res: Response) => {
    const data = await streetz_cornerController.UserStreetz_cornerList(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

/**
 * Get Streetz corner for user based on filter
 */
router.post(p.UserStreetz_cornerFilter, verifyAuthToken, async (req: any, res: Response) => {
    const data = await streetz_cornerController.UserStreetz_cornerFilter(req.body , req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success});
});

// Export default
export default router;