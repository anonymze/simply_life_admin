import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const AppUsers: CollectionConfig = {
	slug: "app-users",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	auth: {
		maxLoginAttempts: 4,
		tokenExpiration: 60 * 60 * 24 * 60, // 60 days
		// tokenExpiration: 3 * 60, // 3 min
	},
	admin: {
		useAsTitle: "email",
	},
	labels: {
		singular: {
			en: "Mobile app user",
			fr: "Utilisateur application mobile",
		},
		plural: {
			en: "Mobile app users",
			fr: "Utilisateurs application mobile",
		},
	},
	fields: [
		{
			name: "lastname",
			type: "text",
			required: true,
			label: {
				en: "Lastname",
				fr: "Nom",
			},
		},
		{
			name: "firstname",
			type: "text",
			required: true,
			label: {
				en: "Firstname",
				fr: "Prénom",
			},
		},
		{
			name: "email",
			type: "email",
			required: true,
			label: {
				en: "Email",
				fr: "Email",
			},
		},
		{
			name: "phone",
			type: "text",
			required: false,
			label: {
				en: "Phone",
				fr: "Téléphone",
			},
		},
		{
			name: "photo",
			type: "upload",
			relationTo: "media",
			required: false,
			label: {
				en: "Photo",
				fr: "Photo",
			},
		},
		{
			name: "role",
			type: "select",
			required: true,
			saveToJWT: true,
			label: {
				en: "Role",
				fr: "Rôle",
			},
			options: [
				{
					label: {
						en: "Associate",
						fr: "Associé",
					},
					value: "associate",
				},
				{
					label: {
						en: "Employee",
						fr: "Employé",
					},
					value: "employee",
				},
				{
					label: {
						en: "Independent",
						fr: "Indépendant",
					},
					value: "independent",
				},
				{
					label: {
						en: "Visitor",
						fr: "Visiteur",
					},
					value: "visitor",
				},
			],
			defaultValue: "independent",
		},
	],
};
