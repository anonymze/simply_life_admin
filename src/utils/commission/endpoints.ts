import { sendEmail } from "@/emails/email";
import { PayloadRequest } from "payload";
import * as XLSX from "xlsx";
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
  export: {
    method: "get" as const,
    path: "/export/:commissionId",
    handler: async (req: PayloadRequest) => {
      const { commissionId } = req.routeParams as { commissionId: string };
      const email = req.searchParams.get("email");

      if (!commissionId) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      const commission = await req.payload.findByID({
        collection: "commissions",
        id: commissionId,
        depth: 2,
      });

      if (!commission) {
        return Response.json(
          {
            message: "Commission not found",
          },
          {
            status: 404,
          },
        );
      }

      // Create Excel workbook
      const workbook = XLSX.utils.book_new();

      // Prepare data for Excel
      const excelData = [];
      let totalEncours = 0;
      let totalProduction = 0;

      // Headers
      excelData.push(["Fournisseur", "Encours", "Production"]);

      // Process commission suppliers
      if (
        commission.commission_suppliers &&
        commission.commission_suppliers.length > 0
      ) {
        commission.commission_suppliers.forEach((cs) => {
          if (typeof cs === "string" || typeof cs.supplier === "string") return;

          const supplier = cs.supplier.name;
          const encours = cs.encours || 0;
          const production = cs.production || 0;

          excelData.push([supplier, encours, production]);
          totalEncours += encours;
          totalProduction += production;
        });
      }

      // Add totals row
      excelData.push([]);
      excelData.push(["Total", totalEncours, totalProduction]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Commission Data");

      // Generate Excel buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      // Check if email is provided
      if (email) {
        // Send Excel file via email
        await sendEmail({
          to: email,
          subject: `Export Commission - Groupe Valorem`,
          text: `Veuillez trouver en pièce jointe l'export de commission pour la date du ${new Date(commission.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}`,
          html: `
            <h2>Export Commission</h2>
            <p>Veuillez trouver en pièce jointe l'export de commission pour l'ID: <strong>${commissionId}</strong></p>
            <p>L'export contient:</p>
            <ul>
              <li>Tous les fournisseurs avec leurs données respectives</li>
              <li>Montants d'encours et de production</li>
              <li>Calculs des totaux</li>
            </ul>
          `,
          attachments: [
            {
              filename: `commission_${commissionId}.xlsx`,
              content: buffer,
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          ],
        });

        return Response.json({
          message: "Export de commission envoyé avec succès à " + email,
          success: true,
        });
      } else {
        // Return Excel file directly
        return new Response(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="commission_${commissionId}.xlsx"`,
          },
        });
      }
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

      if (
        !data ||
        !data.commission_suppliers.length ||
        !data.app_user ||
        !data.date
      ) {
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

      return Response.json(
        { success: true },
        {
          status: 201,
        },
      );
    },
  },
};

export { endpointsCommission };
