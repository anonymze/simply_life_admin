import { canAccessApi, validateMedia } from "@/utils/helper";
import { type CollectionConfig } from "payload";


export const SupplierCategories: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	admin: {
		group: {
			en: "Suppliers",
			fr: "Fournisseurs",
		},
		// defaultColumns: ["name", "range", "price", "priceType", "threshold"],
		useAsTitle: "name",
	},
	slug: "supplier-categories",
	labels: {
		singular: {
			en: "Supplier category",
			fr: "Catégorie de fournisseurs",
		},
		plural: {
			en: "Supplier categories",
			fr: "Catégories de fournisseurs",
		},
	},
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
			admin: {
				description: "Le fichier doit être une image.",
			},
			// @ts-expect-error
			validate: (data) => {
				return validateMedia(data);
			},
			label: {
				en: "Logo",
				fr: "Logo",
			},
			required: false,
		},
		{
			name: "product_suppliers",
			type: "relationship",
			relationTo: "supplier-products",
			hasMany: true,
			label: {
				en: "Supplier products",
				fr: "Produits fournisseurs",
			},
			required: true,
		},
		{
			name: "offers",
			type: "array",
			label: {
				en: "Offers / Promotions / Brochures",
				fr: "Offres / Promotions / Brochures",
			},
			labels: {
				singular: {
					en: "Offer / Promotion / Brochure",
					fr: "Offre / Promotion / Brochure",
				},
				plural: {
					en: "Offers / Promotions / Brochures",
					fr: "Offres / Promotions / Brochures",
				},
			},
			fields: [
				{
					name: "name",
					type: "text",
					label: {
						en: "Brochure name",
						fr: "Nom de la brochure",
					},
					required: true,
				},
				{
					name: "file",
					type: "upload",
					relationTo: "media",
					// @ts-expect-error
					validate: (data) => {
						return validateMedia(data, "application/pdf");
					},
					label: {
						en: "Brochure File",
						fr: "Fichier de la brochure",
					},
					admin: {
						description: "Le fichier doit être au format PDF.",
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
			],
		},
	],
};
