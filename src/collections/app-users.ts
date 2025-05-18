import { canAccessApi, validateMedia, validatePassword } from "@/utils/helper";
import { type CollectionConfig } from "payload";
import { sendEmail } from "@/emails/email";
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";


export const initialRegistrationSchema = z.object({
	email: z.string().email(),
	role: z.enum(["associate", "employee", "independent", "visitor"]),
});

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
		components: {
			views: {
				edit: {
					default: {
						Component: "/components/app-users/create-view.tsx",
					},
				},
			},
		},
	},
	labels: {
		singular: {
			en: "User / Organisation chart",
			fr: "Utilisateur  / Organigramme",
		},
		plural: {
			en: "Users / Organisation chart",
			fr: "Utilisateurs / Organigramme",
		},
	},
	hooks: {
		beforeValidate: [validatePassword],
	},
	endpoints: [
		{
			path: "/init-registration",
			method: "post",
			handler: async (req) => {
				try {
					const data = await req.json?.();
					const validatedData = initialRegistrationSchema.parse(data);

					// Check if user already exists
					const existingUser = await req.payload.find({
						collection: "app-users",
						where: {
							email: {
								equals: validatedData.email,
							},
						},
					});

					if (existingUser.docs.length > 0) {
						return Response.json(
							{
								message: "KO",
							},
							{
								status: 400,
							}
						);
					}

					const existingTemporaryUser = await req.payload.find({
						collection: "temporary-app-users",
						where: {
							email: {
								equals: validatedData.email,
							},
						},
					});

					if (existingTemporaryUser.docs.length > 0) {
						await req.payload.delete({
							collection: "temporary-app-users",
							id: existingTemporaryUser.docs[0].id,
						});
					}

					// Create a new temporary user with just email and role
					await req.payload.create({
						collection: "temporary-app-users",
						data: {
							email: validatedData.email,
							role: validatedData.role,
						},
					});

					const language = req.i18n.language === "fr" ? "fr" : "en";

					await sendEmail({
						to: validatedData.email,
						//@ts-ignore
						subject: req.i18n.t("app-users:emailSubject"),
						text: readFileSync(
							join(
								process.cwd(),
								`src/emails/templates/${language}/subscription-app-user.txt`
							),
							"utf-8"
						).replace("{{registrationLink}}", req.payload.config.serverURL),

						html: readFileSync(
							join(
								process.cwd(),
								`src/emails/templates/${language}/subscription-app-user.html`
							),
							"utf-8"
						).replace("{{registrationLink}}", req.payload.config.serverURL),
					});

					return Response.json({
						message: "OK",
					});
				} catch (error) {
					return Response.json(
						{
							message: "KO",
						},
						{
							status: 500,
						}
					);
				}
			},
		},
	],
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
