import { Media, Supplier } from "@/payload-types";
import type { GlobalConfig } from "payload";
import * as XLSX from "xlsx";

import { canAccessApi, validateMedia } from "../utils/helper";


export const CommissionImports: GlobalConfig = {
	slug: "commission-imports",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
	},
	admin: {
		group: {
			en: "Commissions",
			fr: "Commissions",
		},
	},
	endpoints: [
		{
			path: "/:supplierId/:userId",
			method: "get",
			handler: async (req) => {
				try {
					const { supplierId, userId } = req.routeParams as { supplierId: string; userId: string };

					if (!supplierId || !userId) throw new Error();

					// Get the global document
					const commissionImports = await req.payload.findGlobal({
						slug: "commission-imports",
					});

					if (!commissionImports?.files?.length) throw new Error();

					// Find the file for this specific supplier
					const supplierFile = commissionImports.files.find(
						(file) => {
							return (file.supplier as Supplier).id === supplierId
						}
					);

					if (!supplierFile?.file) throw new Error();

					const user = await req.payload.find({
						collection: "app-users-commissions-code",
						where: {
							app_user: {
								equals: userId,
							},
						},
						select: {
							code: true,
						},
					});

					if (!user.docs.length) throw new Error();

					const codes = user.docs.flatMap((doc) => doc.code).map((codeObj) => codeObj.code);

					let totalEncours = 0,
						totalProduction = 0,
						totalStructured = 0;

					try {
						// Download and parse the Excel file
						const response = await fetch((supplierFile.file as Media).url!);
						const buffer = await response.arrayBuffer();
						const workbook = XLSX.read(buffer, { type: "buffer" });
						const sheetName = workbook.SheetNames[0];
						const worksheet = workbook.Sheets[sheetName];

						// Convert worksheet to JSON for easier processing
						const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

						// Search for codes in column A (index 0)
						data.forEach((row: any) => {
							const codeInColumnA = row[0]; // Column A
							const typeInColumnD = row[3]; // Column D
							const amountInColumnR = row[17]; // Column R

							if (!codeInColumnA || !typeInColumnD || !amountInColumnR) return;

							const codeString = codeInColumnA.toString();
							if (!codes.includes(codeString)) return;

							// Check the type in column D
							const typeString = typeInColumnD.toString().toLowerCase();
							const amount = parseFloat(amountInColumnR) || 0;

							if (typeString.includes("chiffre") || typeString.includes("arbitrage")) {
								totalProduction += amount;
							} else if (typeString.includes("encours")) {
								totalEncours += amount;
							} else if (typeString.includes("structured product")) {
								totalStructured += amount;
							}
						});
					} catch (error) {
						console.error(`Error reading file:`, error);
					}

					return Response.json({
						totalEncours,
						totalProduction,
						totalStructured,
					});
				} catch (error) {
					console.log(error);
					return Response.json(
						{
							message: "KO",
						},
						{
							status: 500,
						}
					);
				}
			},
		},
	],
	fields: [
		{
			name: "files",
			type: "array",
			label: {
				en: "Commission Files",
				fr: "Fichiers de commission",
			},
			admin: {
				description:
					"Un fichier par fournisseur. Quand un fichier est importé pour un fournisseur, il écrase le précédent fichier importé pour celui-ci.",
			},
			labels: {
				singular: {
					en: "file",
					fr: "fichier",
				},
				plural: {
					en: "files",
					fr: "fichiers",
				},
			},
			validate: (data) => {
				const suppliers = data?.map((file: any) => file.supplier);
				const uniqueSuppliers = [...new Set(suppliers)];
				if (uniqueSuppliers.length !== suppliers?.length)
					return "Vous avez mis plusieurs fois le même fournisseur.";
				return true;
			},
			fields: [
				{
					name: "supplier",
					type: "relationship",
					relationTo: "suppliers",
					hasMany: false,
					label: {
						en: "Supplier",
						fr: "Fournisseur",
					},
					required: true,
				},
				{
					name: "file",
					type: "upload",
					relationTo: "media",
					// @ts-expect-error
					validate: (data) => {
						return validateMedia(data, "sheet");
					},
					label: {
						en: "Commission file",
						fr: "Fichier de commission",
					},
					admin: {
						description: "Le fichier doit être au format Excel ou CSV.",
					},
					required: true,
				},
			],
		},
	],
}; 