import { CommissionImport, Media } from "@/payload-types";
import type { CollectionConfig } from "payload";
import * as XLSX from "xlsx";

import { canAccessApi, validateMedia } from "../utils/helper";


export const CommissionImports: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "commission-imports",
	labels: {
		singular: {
			en: "Commission import",
			fr: "Import des commission",
		},
		plural: {
			en: "Commission imports",
			fr: "Import de commissions",
		},
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

					console.log(supplierId, userId);

					if (!supplierId || !userId) throw new Error();

					// user mila
					// 00791bac-7de8-46b2-a2dc-294ad80cdd8a

					//  supplier cléquy
					// 049a54ce-43bf-4ba8-9741-ae67f0e0f407

					const commissionImports = await req.payload.find({
						collection: "commission-imports",
						where: {
							"files.supplier": {
								equals: supplierId,
							},
						},
						select: {
							files: {
								file: true,
							},
						},
					});

					if (!commissionImports.docs.length) throw new Error();

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
					const files = commissionImports.docs.flatMap((doc) => doc.files).map((fileObj) => fileObj?.file);

					let totalEncours = 0,
						totalProduction = 0,
						totalStructured = 0;

					// Use Promise.all to wait for all async operations
					await Promise.all(
						files.map(async (file) => {
							try {
								// Download and parse the Excel file directly
								const response = await fetch((file as Media).url!);
								const buffer = await response.arrayBuffer();
								const workbook = XLSX.read(buffer, { type: "buffer" });
								const sheetName = workbook.SheetNames[0];
								const worksheet = workbook.Sheets[sheetName];

								// Convert worksheet to JSON for easier processing
								const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

								// Search for codes in column A (index 0)
								data.forEach((row: any, rowIndex: number) => {
									const codeInColumnA = row[0]; // Column A
									const typeInColumnD = row[3]; // Column D
									const amountInColumnR = row[17]; // Column R

									if (!codeInColumnA || !typeInColumnD || !amountInColumnR) return;

									const codeString = codeInColumnA.toString();
									if (!codes.includes(codeString)) return;

									// Check the type in column E
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
								console.error(`Error reading file ${file}:`, error);
							}
						})
					);

					console.log(totalEncours, totalProduction, totalStructured);

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
	hooks: {
		beforeOperation: [
			async ({ req, operation }) => {
				if (operation === "create") {
					const files = req?.data?.files;

					if (!files?.length) return;

					Promise.all(
						files.map(async (fileEntity: NonNullable<typeof files>[number]) => {
							if (typeof fileEntity.supplier !== "string" || !fileEntity.supplier) return;

							await req.payload.delete({
								collection: "commission-imports",
								where: {
									"files.supplier": {
										equals: fileEntity.supplier,
									},
								},
							});
						})
					);
				}
			},
		],
	},
	fields: [
		{
			name: "files",
			type: "array",
			label: {
				en: "Global files commission",
				fr: "Fichiers global de commission",
			},
			admin: {
				description:
					"Quand un fichier est importé pour un fournisseur, il écrase le précédent fichier importé pour celui-ci. Ensuite les données de ce fichier rempliront les commissions futures des employés concernés.",
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
