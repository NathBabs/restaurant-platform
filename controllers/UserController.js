
import { buildStream } from "../utils/buildStream.js";
import * as fs from "fs";
/* import pckg from '@prisma/client';
const { PrismaClient } = pckg;
const prisma = new PrismaClient(); */
import Prisma from '@prisma/client';
const prisma = new Prisma.PrismaClient();
import moment from 'moment';

/**
 * @param {*} req
 * @param {*} res
 * @param {NextFunction|Response<*, Record<string, *>>} next
 */
export const userEtl = async (req, res, next) => {
    try {

        buildStream(req.file.buffer)
            .on('data', function (data) {
                const temp = data.purchaseHistory;
                for (const order of temp) {
                    order['transactionDate'] = moment(order['transactionDate'], "MM/DD/YYYY LTS").format('YYYY-MM-DD HH:MM:SS');
                    order['transactionDate'] = moment(order['transactionDate']).toDate();
                }
                data.purchaseHistory = {
                    createMany: {
                        data: [...temp]
                    }
                }

                prisma.user.create({
                    data: data
                }).catch((err) => {
                    console.error(err);
                })
            }).on('end', () => {
                console.error("Done");
            })


        return res.status(200).send({
            success: true,
            message: "Users data is being parsed and pushed into the database"
        })

    } catch (error) {
        return res.status(500).send(error);
    }
}