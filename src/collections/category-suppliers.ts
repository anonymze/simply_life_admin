import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const CategorySuppliers: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "category-suppliers",
	fields: [
		{
			name: "name",
			type: "text",
			label: {
				en: "Name",
				fr: "Nom",
			},
			required: true,
		},
		{
			name: "logo",
			type: "upload",
			relationTo: "media",
			label: {
				en: "Logo",
				fr: "Logo",
			},
			required: true,
		},
		{
			name: "product_suppliers",
			type: "relationship",
			relationTo: "product-suppliers",
			hasMany: true,
			label: {
				en: "Product Suppliers",
				fr: "Produits fournisseurs",
			},
			required: true,
		},
		{
			name: "offers",
			type: "array",
			fields: [
				{
					name: "name",
					type: "text",
					label: {
						en: "Offer Name",
						fr: "Nom de l'offre",
					},
					required: true,
				},
				{
					name: "description",
					type: "text",
					label: {
						en: "Offer Description",
						fr: "Description de l'offre",
					},
					required: false,
				},
				{
					name: "file",
					type: "upload",
					relationTo: "media",
					label: {
						en: "Offer File",
						fr: "Fichier de l'offre",
					},
					required: true
				},
			],
		},
	],
};
