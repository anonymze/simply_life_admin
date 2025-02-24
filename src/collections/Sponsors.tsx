import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Sponsors: CollectionConfig = {
	access: {
		read: ({ req: { user } }) => canAccessApi(user, ["coach", "staff", "player"]),
		create: ({ req: { user } }) => canAccessApi(user, []),
		update: ({ req: { user } }) => canAccessApi(user, []),
		delete: ({ req: { user } }) => canAccessApi(user, []),
	},
	slug: "sponsors",
	labels: {
		singular: {
			en: "Sponsor",
			fr: "Sponsor",
		},
		plural: {
			en: "Sponsors",
			fr: "Sponsors",
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
				en: "Sponsor name",
				fr: "Nom du sponsor",
			},
		},
		{
			name: "logo",
			type: "upload",
			required: true,
			relationTo: "media",
			label: {
				en: "Logo",
				fr: "Logo",
			},
		},
		{
			name: "category",
			type: "select",
			required: true,
			options: ["gold", "silver", "bronze", "diamond"],
			label: {
				en: "Category",
				fr: "Catégorie",
			},
		},
		{
			name: "website",
			type: "text",
			label: {
				en: "Website",
				fr: "Site web",
			},
		},
		{
			name: "latitude",
			type: "number",
			admin: {
				step: 0.00001,
			},
			label: {
				en: "Latitude",
				fr: "Latitude",
			},
		},
		{
			name: "longitude",
			type: "number",
			admin: {
				step: 0.00001,
			},
			label: {
				en: "Longitude",
				fr: "Longitude",
			},
		},
	],
};
