import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const SponsorCategories: CollectionConfig = {
	slug: "sponsor-categories",
	access: {
		read: ({ req: { user } }) => canAccessApi(user, ["coach", "staff", "player", "visitor"]),
		create: ({ req: { user } }) => canAccessApi(user, []),
		update: ({ req: { user } }) => canAccessApi(user, []),
		delete: ({ req: { user } }) => canAccessApi(user, []),
	},
	labels: {
		singular: {
			en: "Sponsor category",
			fr: "Catégorie de sponsor",
		},
		plural: {
			en: "Sponsor categories",
			fr: "Catégories de sponsors",
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

