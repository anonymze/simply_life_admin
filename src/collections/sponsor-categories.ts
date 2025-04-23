import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const SponsorCategories: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "sponsor-categories",
	labels: {
		singular: {
			en: "Contacts type",	
			fr: "Type de contacts",
		},
		plural: {
			en: "Contact types",
			fr: "Types de contacts",
		},
	},
	admin: {
		useAsTitle: "name",
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

