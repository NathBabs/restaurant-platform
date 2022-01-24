import Prisma from '@prisma/client';
const prisma = new Prisma.PrismaClient({
    errorFormat: 'pretty',
    log: ['info']
});

export const purchase = async function (from, to, price) {
    return await prisma.$transaction(async (prisma) => {
        // 1. Decrement from the user purchasing
        const user = await prisma.user.update({
            data: {
                cashBalance: {
                    decrement: price
                }
            },
            where: {
                id: from
            }
        });

        //2. verify the user's balance did not go below zero
        if(user.cashBalance < 0 ){
            throw new Error(`${from} doesn't have enough money to purchase this dish of ${price}`)
        }

        //3. increase restaurant's cashBalance by price
        const restaurant = prisma.restaurant.update({
            data: {
                cashBalance: {
                    increment: price
                }
            },
            where: {
                id: to
            }
        });
        return restaurant;
    })
}