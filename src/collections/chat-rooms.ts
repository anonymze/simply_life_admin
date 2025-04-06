import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const ChatRooms: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["coach", "staff", "player", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["coach", "staff"]),
		update: ({ req }) => canAccessApi(req, ["coach", "staff"]),
		delete: ({ req }) => canAccessApi(req, ["coach", "staff"]),
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
			required: true,
		},
		{
			name: "description",
			type: "text",
			required: true,
		},

		{
			name: "color",
			type: "text",
			required: false,
		},
		{
			name: "category",
			type: "text",
			required: false,
		},
	],
};
