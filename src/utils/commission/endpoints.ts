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
  createCommissionWithCommissionSuppliers: {
    method: "post" as const,
    path: "/commission-suppliers",
    handler: async (req: PayloadRequest) => {
      const data = (await req.json?.()) as {
        app_user: string;
        date: string;
        commission_suppliers: [
          {
            supplier: string;
            encours: number;
            production: number;
          },
        ];
      } | null;

      if (!data) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      const commissionSuppliers = await Promise.all(
        data.commission_suppliers.map(async (commissionSupplier) => {
          return await req.payload.create({
            collection: "commission-suppliers",
            data: {
              encours: commissionSupplier.encours,
              production: commissionSupplier.production,
              supplier: commissionSupplier.supplier,
            },
          });
        }),
      );

      await req.payload.create({
        collection: "commissions",
        data: {
          app_user: data.app_user,
          date: data.date,
          commission_suppliers: commissionSuppliers.map(
            (supplier) => supplier.id,
          ),
        },
      });

      return Response.json({});
    },
  },
};

export { endpointsCommission };
