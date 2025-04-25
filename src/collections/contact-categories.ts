import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const ContactCategories: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "contact-categories",
	labels: {
		singular: {
			en: "Contact category",	
			fr: "Catégorie de contact",
		},
		plural: {
			en: "Contact categories",
			fr: "Catégories de contacts",
		},
	},
	admin: {
		useAsTitle: "name",
		group: {
			en: "Contacts map",
			fr: "Carte des contacts",
		},
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: {
				en: "Category name",
				fr: "Nom de la catégorie",
			},
		},
	],
};

