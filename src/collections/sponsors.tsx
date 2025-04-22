import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Sponsors: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "sponsors",
	labels: {
		singular: {
			en: "Contacts",
			fr: "Contacts",
		},
		plural: {
			en: "Contacts",
			fr: "Contacts",
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
				en: "Contact name",
				fr: "Nom du contact",
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
