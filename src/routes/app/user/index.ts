import { Router } from 'express';

import authRoute from './auth';
import postRoute from './posts';
import streetz_cornerRoute from './streetz_corner';


// Export the base-router

const baseRouter = Router();

// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/post', postRoute);
baseRouter.use('/corner',streetz_cornerRoute);


// Export default.
export default baseRouter;