import { PayloadRequest } from "payload";
import {
  organizeCommissionsByMonth,
  organizeCommissionsByYear,
} from "./commission";

const endpointsCommission = {
  formatedData: {
    method: "get" as const,
    path: "/extra/:userId",
    handler: async (req: PayloadRequest) => {
      const { userId } = req.routeParams as { userId: string };

      if (!userId) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      const commissions = await req.payload.find({
        collection: "commissions",
        sort: "-informations.date",
        select: {
          app_user: false,
        },
        depth: 2,
        limit: 0,
        where: {
          app_user: {
            equals: userId,
          },
        },
      });

      // Organize commissions by month with already populated suppliers
      const { monthlyData, total } = organizeCommissionsByMonth(
        commissions.docs,
      );
      const { yearlyData, total: yearlyTotal } = organizeCommissionsByYear(
        commissions.docs,
      );

      return Response.json({
        monthlyData,
        yearlyData,
        totalAmountMonth: total,
        totalAmountYear: yearlyTotal,
      });
    },
  },
};

export { endpointsCommission };
