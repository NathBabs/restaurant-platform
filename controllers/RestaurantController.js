// import pckg from '@prisma/client';
// const { PrismaClient } = pckg;
// const prisma = new PrismaClient();
//const {} =  Prisma
import Prisma from '@prisma/client';
const prisma = new Prisma.PrismaClient({
    errorFormat: 'pretty',
    log: ['info']
});
import _ from 'lodash';
import { buildStream } from "../utils/buildStream.js";
import { buildOpeningHours } from "../utils/parseHours.js";
import restaurant from "../routes/restaurant.js";
import {response} from "express";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<*>}
 */
export const restaurantEtl = async (req, res, next) => {
    try {
        buildStream(req.file.buffer)
            .on('data', function (data) {
                const opening_hours = data.openingHours;
                //const split_hours = opening_hours.split('/');
                const hours = buildOpeningHours(opening_hours);

                const { openingHours, ...restaurantData } = data;

                restaurantData.opening_hours = {
                    createMany: {
                        data: [...hours]
                    }
                }

                const temp = restaurantData.menu;

                restaurantData.menu = {
                    createMany: {
                        data: [...temp]
                    }
                }

                // if(!_.isDate(restaurantData.opening_hours.opens_at)){
                //     console.log(JSON.stringify(restaurantData, null, 4));
                //     throw new Error('Missing date value');
                // }

                //console.log(JSON.stringify(restaurantData, null, 4));
                //console.log(restaurantData.opening_hours);
                prisma.restaurant.create({
                    data: restaurantData
                }).then((data) => {
                    console.log("processed");
                }).catch((err) => {
                    console.log("error");
                    return;
                    // console.log(JSON.stringify(restaurantData, null, 4));
                    // throw new Error('faulty data');
                })
            })

        return res.status(200).send({
            success: true,
            message: "Restaurants data is being parsed and pushed into the database"
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}


// search for restaurants and dishes by name
export const searchRestaurants = async (req, res, next) => {
    try {
        // build where filter if any of the query properties exist
        // const where = {
        //     ...((req.query.restaurantName) && {
        //         restaurantName: {
        //             search: req.query.restaurantName
        //     } }),
        //     ...((req.query.dishName) && {
        //         menu: {
        //             dishName: {
        //                 search: req.query.dishName
        //             }
        //         }
        //     })
        // };
        // console.log('where', where)

        let results = [];

        if (req.query.restaurantName) {
            const restaurants = await prisma.restaurant.findMany({
                where: {
                    restaurantName: {
                        search: req.query.restaurantName
                    }
                },
                orderBy: {
                    _relevance: {
                        fields: ["restaurantName"],
                        search: req.query.restaurantName,
                        sort: "desc"
                    }
                }
            });

            results.push({
                restaurants: restaurants
            })
        }


        if (req.query.dishName){
            const dishes = await prisma.menu.findMany({
                where: {
                    dishName: {
                        search : req.query.dishName
                    }
                },
                orderBy: {
                    _relevance: {
                        fields: ['dishName'],
                        search: req.query.dishName,
                        sort: 'asc'
                    }
                }
            });

            results.push({
                dishes: dishes
            })
        }

        // const result = await prisma.restaurant.findMany({
        //     where: {
        //         restaurantName: {
        //             contains: 'Japanese'
        //         }
        //     }
        // })

        return res.status(201).send({
            success: true,
            results: results
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        })
    }
}

/**
 * List top Y restaurants that have more or less than X number of dishes within a price range
 * list 100 restaurants that have 5 dishes within 100 and 1200 naira
 * ?noOfRest=9&noOfdishes=10&upperRange=10&lowerRange=50&condition=gt
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export const listRestaurant = async  (req, res, next) => {
    try{
        const {noOfRest, noOfdishes, upperRange, lowerRange, condition} = req.query;

        //const splitRange = priceRange.split('-');
        const lowerLimit = Number(lowerRange);
        const upperLimit = Number(upperRange)

        console.log({
            lower: lowerLimit,
            upperLimit: upperLimit
        })

        // if it's lower than (less than 5 noOfDishes) change _count to asc order
        const results = await prisma.restaurant.findMany({
            where: {
                menu: {
                    every: {
                        price: {
                            lte: upperLimit,
                            gte: lowerLimit,
                        }
                    }
                }
            },
            orderBy: {
                menu: {
                    _count: 'desc'
                }
            },
            include: {
                menu: true
            }
        })

        //console.log('results', results);
        let sorted;

        // greater than X {noOfdishes}
        if(condition === 'gt'){
            sorted = results.filter((restaurant) => {
                return restaurant.menu.length > noOfdishes
            })
        }else{
            // else return those that are less than X {noOfdishes}
            sorted = results.filter((restaurant) => {
                return restaurant.menu.length < noOfdishes
            })
        }

        // then take the top Y restaurants from the array
        const part = sorted.slice(0, noOfRest);

        return res.status(200).send({
            success: true,
            data: part
        })

    }catch(error){
        console.log(error);
        return res.status(400).send({
            success: false,
            error: error.message
        })
    }
}



/**
 * list all restaurants that open by a certain dateTime
 * ?day=wed&time8:00pm
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export const searchOpeningHours = async (req, res, next) => {
    try{

    }catch(error){

    }
}