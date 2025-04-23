import type { CollectionConfig } from "payload";

import { canAccessApi, SSEMessages } from "../utils/helper";


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
	endpoints: [SSEMessages],
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
			label: {
				en: "Message",
				fr: "Message",
			},
			required: true,
		},
	],
};

