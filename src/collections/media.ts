import { canAccessApi, generateBlurHash } from "@/utils/helper";
import type { CollectionConfig } from "payload";


export const Media: CollectionConfig = {
	slug: "media",
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
		{
			name: "blurhash",
			type: "text",
			required: false,
			admin: {
				hidden: true,
				disableListColumn: true,
				disableListFilter: true,
			},
		},
	],
	hooks: {
		beforeValidate: [generateBlurHash],
	},

	upload: true,
};



