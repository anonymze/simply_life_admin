import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const ChatRooms: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate"]),
		update: ({ req }) => canAccessApi(req, ["associate"]),
		delete: ({ req }) => canAccessApi(req, ["associate"]),
	},
	admin: {
		hidden: true,
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
			name: "guests",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			hasMany: true,
			maxDepth: 1,
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
			required: false,
		},
		{
			name: "color",
			type: "text",
			required: false,
		}
	],
};
