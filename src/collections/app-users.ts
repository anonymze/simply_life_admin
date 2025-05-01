import { canAccessApi, validateMedia, validatePassword } from "@/utils/helper";
import { getPayload, type CollectionConfig } from "payload";
import config from "@payload-config";


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
		group: {
			en: "Users",
			fr: "Utilisateurs",	
		},
		// defaultColumns: ["name", "range", "price", "priceType", "threshold"],
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
	hooks: {
		beforeValidate: [validatePassword],
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
			admin: {
				description: "Le fichier doit être une image.",
			},
			// @ts-expect-error
			validate: (data) => {
				return validateMedia(data);
			},
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
		{
			name: "description-below-password",
			type: "ui",
			
			admin: {
				components: {
					Field: "/components/description-below-password.tsx",
				},
			},
		},
	],
};
