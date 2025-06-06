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
