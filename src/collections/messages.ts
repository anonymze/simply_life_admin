import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Messages: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["coach", "staff", "player", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["coach", "staff"]),
		update: ({ req }) => canAccessApi(req, ["coach", "staff"]),
		delete: ({ req }) => canAccessApi(req, ["coach", "staff"]),
	},
	slug: "messages",
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			hasMany: false,
		},
		{
			name: "chat_room",
			type: "relationship",
			relationTo: "chat-rooms",
			required: true,
			hasMany: false,
		},
		{
			name: "message",
			type: "text",
			required: true,
		},
	],
};
