import * as express from 'express';
const router = express.Router();

import { restaurantEtl, searchRestaurants, listRestaurant, searchOpeningHours } from "../controllers/RestaurantController.js";
import { upload } from "../utils/upload.js";

// upload restaurant data
router.route('/buying-frenzy/upload/restaurant').post(upload.single('restaurants-data'), restaurantEtl);

// search for restaurants or dishes by name , ranked by relevance to search term
router.route('/buying-frenzy/restaurants').get(searchRestaurants);

// list restaurants by price range of dishes
router.route('/buying-frenzy/restaurants/lists').get(listRestaurant);

// find restaurants that are open by a certain time
router.route('/buying-frenzy/restaurants/open').get(searchOpeningHours);

export default router;