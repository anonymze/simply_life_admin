import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Messages: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "messages",
	defaultPopulate: {
		app_user: {
			email: true,
			id: true,
			lastname: true,
			firstname: true,
			photo: true,
		},
		chat_room: {
			populate: true,
		},
	},
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			maxDepth: 2,
			hasMany: false,
			filterOptions: () => {
				return true;
			},
			admin: {
				readOnly: true,
			},
		},
		{
			name: "chat_room",
			type: "relationship",
			// only id for now
			maxDepth: 0,
			relationTo: "chat-rooms",
			hasMany: false,
			required: true,
		},
		{
			name: "message",
			type: "text",
			label: {
				en: "Message",
				fr: "Message",
			},
			required: true,
		},
	],
};
