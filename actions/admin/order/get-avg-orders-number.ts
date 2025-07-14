"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetAvgOrderSalesDataResponse, } from '@/types/get-data-response';
import { cache } from 'react';


export const getAVGOrdersSales = cache(async (months: { from: string, to: string }) => {

    try {
        const ordersAvgTotals = await prisma?.order.aggregate({
            orderBy: {
                createdAt: "asc"
            },
            where: {
                createdAt: {
                    gte: new Date(months.from),
                    lte: new Date(months.to)
                }
            }
        });

        // Map the results to include the month name as a string (e.g., "January")


        return {
            data: ordersAvgTotals,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching avg order sales",
            success: false
        };
    }
})

