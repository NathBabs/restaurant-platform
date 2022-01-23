import * as express from 'express';
const router = express.Router();

import { restaurantEtl, searchRestaurants, listRestaurant } from "../controllers/RestaurantController.js";
import { upload } from "../utils/upload.js";

// upload restaurant data
router.route('/buying-frenzy/upload/restaurant').post(upload.single('restaurants-data'), restaurantEtl);

// search for restaurants or dishes by name , ranked by relevance to search term
router.route('/buying-frenzy/restaurants').get(searchRestaurants);

// list restaurants by price range of dishes
router.route('/buying-frenzy/restaurants/lists').get(listRestaurant);

export default router;