import { getPayload, type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";
import payloadConfig from "@/payload.config";
import config from "@payload-config";


export const CategorySuppliers: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	admin: {
		useAsTitle: "name",
	},
	slug: "category-suppliers",
	labels: {
		singular: {
			en: "Category supplier",
			fr: "Catégorie de fournisseurs",
		},
		plural: {
			en: "Category suppliers",
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
			label: {
				en: "Logo",
				fr: "Logo",
			},
			required: false,
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
					validate: async (data: string) => {
						console.log(data);
						const payload = await getPayload({
							config,
						});
						const file = await payload.findByID({
							collection: "media",
							id: data,
						});

						if (file.mimeType !== "application/pdf") return "Le fichier doit être au format PDF.";
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
