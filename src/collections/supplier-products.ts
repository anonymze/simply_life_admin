import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const SupplierProducts: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	labels: {
		singular: {
			en: "Supplier product",
			fr: "Produit de fournisseurs",
		},
		plural: {
			en: "Supplier products",
			fr: "Produits de fournisseurs",
		},
	},
	admin: {
		group: {
			en: "Suppliers",
			fr: "Fournisseurs",
		},
		// defaultColumns: ["name", "range", "price", "priceType", "threshold"],
		useAsTitle: "name",
	},
	slug: "supplier-products",
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
