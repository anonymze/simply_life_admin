import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const ChatRooms: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate"]),
		update: ({ req }) => canAccessApi(req, ["associate"]),
		delete: ({ req }) => canAccessApi(req, ["associate"]),
	},
	slug: "chat-rooms",
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			hasMany: false,
		},
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
			name: "description",
			type: "text",
			label: {
				en: "Description",
				fr: "Description",
			},
			required: false,
		},
		{
			name: "color",
			type: "text",
			label: {
				en: "Color",
				fr: "Couleur",
			},
			required: false,
		},
		{
			name: "category",
			type: "text",
			label: {
				en: "Category",
				fr: "Catégorie",
			},
			required: false,
		},
		{
			name: "private",
			type: "checkbox",
			label: {
				en: "Private",
				fr: "Privé",
			},
			required: false,
		},
	],
};
