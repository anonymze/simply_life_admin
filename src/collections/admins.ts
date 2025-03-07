import type { CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const Admins: CollectionConfig = {
	slug: "admins",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	labels: {
		singular: {
			en: "Admin",
			fr: "Administrateur",
		},
		plural: {
			en: "Admins",
			fr: "Administrateurs",
		},
	},
	admin: {
		useAsTitle: "email",
	},
	//email and password added by default
	auth: {
		maxLoginAttempts: 3,
		tokenExpiration: 60 * 60 * 24 * 7, // 7 days
	},
	fields: [
		{
			name: "fullname",
			type: "text",
			required: true,
			label: {
				en: "Full name",
				fr: "Nom complet",
			},
		},
	],
};
