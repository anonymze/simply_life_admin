import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const ProductSuppliers: CollectionConfig = {
	labels: {
		singular: {
			en: "Product supplier",
			fr: "Produit de fournisseurs",
		},
		plural: {
			en: "Product suppliers",
			fr: "Produits de fournisseurs",
		},
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "product-suppliers",
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
			name: "suppliers",
			type: "relationship",
			relationTo: "suppliers",
			hasMany: true,
			label: {
				en: "Suppliers",
				fr: "Fournisseurs",
			},
			required: true,
		},
	],
};
