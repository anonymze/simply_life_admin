import type { CollectionConfig } from "payload";

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
	fields: [
		{
			name: "files",
			type: "array",
			label: {
				en: "Global file commission",
				fr: "Fichier global de commission",
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
					required: true
				},
				{
					name: "file",
					type: "upload",
					relationTo: "media",
					// @ts-expect-error
					validate: (data) => {
						return validateMedia(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
					},
					label: {
						en: "Commission file",
						fr: "Fichier de commission",
					},
					admin: {
						description: "Le fichier doit être au format EXCEL ou CSV.",
					},
					required: true,
				},
			],
		},
	],
};
