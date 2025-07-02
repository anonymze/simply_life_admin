import { Commission } from "@/payload-types";
import type { CollectionConfig } from "payload";

import { canAccessApi, validateMedia } from "../utils/helper";

export const Commissions: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  slug: "commissions",
  admin: {
    group: {
      en: "Commissions",
      fr: "Commissions",
    },
  },
  endpoints: [
    {
      method: "get",
      path: "/extra/:userId",
      handler: async (req) => {
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
  ],

  fields: [
    {
      name: "app_user",
      type: "relationship",
      relationTo: "app-users",
      label: {
        en: "Employee concerned",
        fr: "Employé concerné",
      },
      required: true,
      hasMany: false,
    },
    {
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",
      label: {
        en: "Supplier",
        fr: "Fournisseur",
      },
      required: true,
      hasMany: false,
    },
    {
      name: "structured_product",
      type: "checkbox",
      label: {
        en: "Structured product",
        fr: "Produit structuré",
      },
      required: false,
    },
    {
      name: "informations",
      type: "group",
      admin: {
        condition: (data) => {
          return !!data?.supplier && !!data?.app_user;
        },
      },
      label: {
        en: "Commission Details",
        fr: "Informations de commission",
      },
      fields: [
        {
          name: "auto_fill_button",
          type: "ui",

          admin: {
            components: {
              Field: "/components/commission-auto-fill.tsx",
            },
          },
          label: {
            en: "Auto-fill from Excel",
            fr: "Auto-remplir depuis Excel",
          },
        },
        {
          name: "date",
          type: "date",
          defaultValue: new Date(),
          admin: {
            date: {
              displayFormat: "MM/yyyy",
              pickerAppearance: "monthOnly",
            },
          },
          label: {
            en: "Date of commission",
            fr: "Date de commission",
          },
          required: true,
        },
        {
          name: "encours",
          type: "number",
          admin: {
            step: 0.01,
            condition: (data) => {
              return !data.structured_product;
            },
          },
          label: {
            en: "Encours",
            fr: "Encours",
          },
          required: false,
        },
        {
          name: "production",
          type: "number",
          admin: {
            step: 0.01,
            condition: (data) => {
              return !data.structured_product;
            },
          },
          label: {
            en: "Production",
            fr: "Production",
          },
          required: false,
        },
        {
          name: "pdf",
          type: "upload",
          relationTo: "media",
          admin: {
            condition: (data) => {
              return !data.structured_product;
            },
          },
          label: {
            en: "Commission PDF",
            fr: "Fichier de commission en PDF",
          },
          // @ts-expect-error
          validate: (data) => {
            return validateMedia(data, "application/pdf");
          },
          required: false,
        },
        {
          name: "title",
          type: "text",
          admin: {
            condition: (data) => {
              return data.structured_product;
            },
          },
          label: {
            en: "Title",
            fr: "Titre",
          },
          required: false,
        },
        {
          name: "up_front",
          type: "number",

          admin: {
            step: 0.01,
            condition: (data) => {
              return data.structured_product;
            },
          },
          label: {
            en: "Amount (up-front)",
            fr: "Montant (up-front)",
          },
          required: false,
        },
        {
          name: "broqueur",
          type: "text",

          admin: {
            condition: (data) => {
              return data.structured_product;
            },
          },
          label: {
            en: "Broqueur",
            fr: "Broqueur",
          },
          required: false,
        },
      ],
    },
    {
      name: "sidebar_actions",
      type: "ui",
      admin: {
        condition: (data) => {
          return !!data?.id;
        },
        position: "sidebar",
        components: {
          Field: "/components/commission-sidebar.tsx",
        },
      },
    },
  ],
};

const organizeCommissionsByMonth = (
  commissions: Omit<Commission, "app_user">[],
) => {
  const monthlyData: Record<
    string,
    {
      id: string;
      labelDate: string;
      commissions: Omit<Commission, "app_user">[];
      totalAmount: number;
      groupedData: {
        encours: number;
        production: number;
        structured_product: number;
      };
      comparison?: {
        difference: number;
        percentageChange: number;
        previousMonthTotal: number;
      };
    }
  > = {};

  let overallTotal = 0;

  // Process commissions (suppliers are already populated)
  commissions.forEach((commission) => {
    if (!commission.informations?.date) return;

    const date = new Date(commission.informations.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        id: crypto.randomUUID(),
        labelDate: monthName,
        commissions: [],
        totalAmount: 0,
        groupedData: {
          encours: 0,
          production: 0,
          structured_product: 0,
        },
      };
    }

    monthlyData[monthKey].commissions.push(commission);

    // Calculate amounts
    const encours = commission.informations.encours || 0;
    const production = commission.informations.production || 0;
    const upFront = commission.informations.up_front || 0;
    const total = encours + production + upFront;

    monthlyData[monthKey].totalAmount += total;
    monthlyData[monthKey].groupedData.encours += encours;
    monthlyData[monthKey].groupedData.production += production;
    monthlyData[monthKey].groupedData.structured_product += upFront;

    // Add to overall total
    overallTotal += total;
  });

  // Clean up Infinity values for months with no commissions and sort months chronologically
  const sortedMonths = Object.keys(monthlyData);

  sortedMonths.forEach((monthKey, index) => {
    const currentMonth = monthlyData[monthKey];

    const previousMonthKey = sortedMonths[index + 1];

    if (previousMonthKey) {
      const previousMonth = monthlyData[previousMonthKey];
      const difference = currentMonth.totalAmount - previousMonth.totalAmount;
      const percentageChange =
        previousMonth.totalAmount > 0
          ? (difference / previousMonth.totalAmount) * 100
          : 0;

      currentMonth.comparison = {
        difference,
        percentageChange,
        previousMonthTotal: previousMonth.totalAmount,
      };
    }
  });

  return {
    monthlyData: Object.values(monthlyData),
    total: overallTotal,
  };
};

const organizeCommissionsByYear = (
  commissions: Omit<Commission, "app_user">[],
) => {
  const yearlyData: Record<
    string,
    {
      id: string;
      labelDate: string;
      totalAmount: number;
      groupedData: {
        encours: number;
        production: number;
        structured_product: number;
      };
      comparison?: {
        difference: number;
        percentageChange: number;
        previousYearTotal: number;
      };
    }
  > = {};

  let overallTotal = 0;

  // Process commissions (suppliers are already populated)
  commissions.forEach((commission) => {
    if (!commission.informations?.date) return;

    const date = new Date(commission.informations.date);
    const yearKey = date.getFullYear().toString();
    const yearName = date.toLocaleDateString("fr-FR", { year: "numeric" });

    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = {
        id: crypto.randomUUID(),
        labelDate: yearName,
        totalAmount: 0,
        groupedData: {
          encours: 0,
          production: 0,
          structured_product: 0,
        },
      };
    }

    // Calculate amounts
    const encours = commission.informations.encours || 0;
    const production = commission.informations.production || 0;
    const upFront = commission.informations.up_front || 0;
    const total = encours + production + upFront;

    yearlyData[yearKey].totalAmount += total;
    yearlyData[yearKey].groupedData.encours += encours;
    yearlyData[yearKey].groupedData.production += production;
    yearlyData[yearKey].groupedData.structured_product += upFront;

    // Add to overall total
    overallTotal += total;
  });

  // Clean up Infinity values for years with no commissions and sort years chronologically
  const sortedYears = Object.keys(yearlyData);

  sortedYears.forEach((yearKey, index) => {
    const currentYear = yearlyData[yearKey];

    const previousYearKey = sortedYears[index + 1];

    if (previousYearKey) {
      const previousYear = yearlyData[previousYearKey];
      const difference = currentYear.totalAmount - previousYear.totalAmount;
      const percentageChange =
        previousYear.totalAmount > 0
          ? (difference / previousYear.totalAmount) * 100
          : 0;

      currentYear.comparison = {
        difference,
        percentageChange,
        previousYearTotal: previousYear.totalAmount,
      };
    }
  });

  return {
    yearlyData: Object.values(yearlyData),
    total: overallTotal,
  };
};
