import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const AgencyLife: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	labels: {
		singular: {
			en: "Agency life",
			fr: "Vie d'agence",
		},
		plural: {
			en: "Agency lives",
			fr: "Vies d'agence",
		},
	},
	admin: {
		useAsTitle: "title",
	},
	slug: "agency-life",
	fields: [
		{
			name: "title",
			type: "text",
			label: {
				en: "Title",
				fr: "Titre",
			},
			required: true,
		},
		{
			name: "annotation",
			type: "text",
			label: {
				en: "Annotation",
				fr: "Annotation",
			},
			required: false,
		},
		{
			name: "type",
			type: "select",
			required: true,
			label: {
				en: "Events type",
				fr: "Type d'évènements",
			},
			options: [
				{
					label: {
						en: "General",
						fr: "Général",
					},
					value: "general",
				},
			],
			defaultValue: "general",
		},
		{
			name: "events-start",
			type: "date",
			label: {
				en: "Events start",
				fr: "Date de début de l'évènement",
			},
			required: true,
		},
		{
			name: "events-end",
			type: "date",
			label: {
				en: "Events end",
				fr: "Date de fin de l'évènement",
			},
			required: true,
		},
	],
};
