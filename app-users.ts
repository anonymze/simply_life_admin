import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


export const AppUsers: CollectionConfig = {
	slug: "app-users",
	access: {
		read: ({ req: { user } }) => canAccessApi(user, []),
		create: ({ req: { user } }) => canAccessApi(user, []),
		update: ({ req: { user } }) => canAccessApi(user, []),
		delete: ({ req: { user } }) => canAccessApi(user, []),
	},
	auth: {
		maxLoginAttempts: 5,
		tokenExpiration: 60 * 60 * 24 * 30, // 30 days		
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
			name: "role",
			type: "select",
			required: true,
			label: {
				en: "Role",
				fr: "Rôle",
			},
			options: [
				{
					label: {
						en: "Coach",
						fr: "Coach",
					},
					value: "coach",
				},
				{
					label: {
						en: "Staff",
						fr: "Personnel",
					},
					value: "staff",
				},
				{
					label: {
						en: "Player",
						fr: "Joueur",
					},
					value: "player",
				},
				{
					label: {
						en: "Visitor",
						fr: "Visiteur",
					},
					value: "visitor",
				},
			],
			defaultValue: "player",
		},
	],
};
