import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Sponsors: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["coach", "staff", "player", "visitor"]),
		create: ({ req }) => false,
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
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
			type: "relationship",
			required: true,
			relationTo: "sponsor-categories",
			label: {
				en: "Category",
				fr: "Catégorie",
			},
		},
		{
			name: "phone",
			type: "text",
			label: {
				en: "Phone",
				fr: "Téléphone",
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
			name: "address",
			type: "text",
			label: {
				en: "Address",
				fr: "Adresse",
			},
		},
		{
			name: "latitude",
			type: "number",
			label: {
				en: "Latitude",
				fr: "Latitude",
			},
		},
		{
			name: "longitude",
			type: "number",
			label: {
				en: "Longitude",
				fr: "Longitude",
			},
		},
	],
};
