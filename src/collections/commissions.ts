import { Commission, Media } from "@/payload-types";
import type { CollectionConfig } from "payload";

import { canAccessApi, validateMedia } from "../utils/helper";


export const Commissions: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
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
						}
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
				const { monthlyData, total } = organizeCommissionsByMonth(commissions.docs);

				return Response.json({
					monthlyData,
					totalAmount: total,
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
					return !!data?.supplier;
				},
			},
			label: {
				en: "Commission Details",
				fr: "Informations de commission",
			},
			fields: [
				{
					name: "date",
					type: "date",
					// defaultValue: new Date(),
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
					required: false,
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

const organizeCommissionsByMonth = (commissions: Omit<Commission, "app_user">[]) => {
	const monthlyData: Record<
		string,
		{
			id: string;
			month: string;
			commissions: Omit<Commission, "app_user">[];
			totalAmount: number;
			groupedData: {
				encours: number;
				production: number;
				structured_product: number;
				total: number;
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
		const monthName = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

		if (!monthlyData[monthKey]) {
			monthlyData[monthKey] = {
				id: crypto.randomUUID(),
				month: monthName,
				commissions: [],
				totalAmount: 0,
				groupedData: {
					encours: 0,
					production: 0,
					structured_product: 0,
					total: 0,
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
		monthlyData[monthKey].groupedData.total += total;

		// Add to overall total
		overallTotal += total;
	});

	// Sort months chronologically and add comparison data
	const sortedMonths = Object.keys(monthlyData);

	sortedMonths.forEach((monthKey, index) => {
		const currentMonth = monthlyData[monthKey];
		const previousMonthKey = sortedMonths[index + 1];

		if (previousMonthKey) {
			const previousMonth = monthlyData[previousMonthKey];
			const difference = currentMonth.totalAmount - previousMonth.totalAmount;
			const percentageChange =
				previousMonth.totalAmount > 0 ? (difference / previousMonth.totalAmount) * 100 : 0;

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
