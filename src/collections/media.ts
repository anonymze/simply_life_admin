import type { CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const Media: CollectionConfig = {
	slug: "media",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
	upload: true,
};
