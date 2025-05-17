import { canAccessApi, validateMedia, validatePassword } from "@/utils/helper";
import { enum_app_users_role } from "@/payload-generated-schema";
import { type CollectionConfig } from "payload";


export const TemporaryAppUsers: CollectionConfig = {
	slug: "temporary-app-users",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	admin: {
		hidden: true,
	},
	fields: [
		{
			name: "email",
			type: "email",
			required: true,
		},
		{
			name: "role",
			type: "select",
			required: true,
			options: enum_app_users_role.enumValues.map((role) => ({
				label: role,
				value: role,
			})),
		},
	],
};
