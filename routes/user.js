import * as express from 'express';
const router = express.Router();

import { userEtl } from '../controllers/UserController.js';
import { upload } from "../utils/upload.js";

// upload user data
router.route('/buying-frenzy/upload/users').post(upload.single('users-data'), userEtl);


export default router;