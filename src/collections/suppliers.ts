import { canAccessApi, validateMedia } from "@/utils/helper";
import { type CollectionConfig } from "payload";


export const Suppliers: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	labels: {
		singular: {
			en: "Supplier",
			fr: "Fournisseur",
		},
		plural: {
			en: "Suppliers",
			fr: "Fournisseurs",
		},
	},
	admin: {
		group: {
			en: "Suppliers",
			fr: "Fournisseurs",
		},
		// defaultColumns: ["name", "range", "price", "priceType", "threshold"],
		useAsTitle: "name",
	},
	slug: "suppliers",

	fields: [
		{
			name: "name",
			type: "text",
			label: {
				en: "Name",
				fr: "Nom",
			},
			required: true,
		},
		{
			name: "logo",
			type: "upload",
			relationTo: "media",
			admin: {
				description: "Le fichier doit être une image.",
			},
			// @ts-expect-error
			validate: (data) => {
				return validateMedia(data);
			},
			label: {
				en: "Logo",
				fr: "Logo",
			},
			required: true,
		},

		{
			name: "contact_info",
			type: "group",
			label: {
				en: "Contact Information",
				fr: "Informations de contact",
			},
			fields: [
				{
					name: "lastname",
					type: "text",
					label: {
						en: "Contact Lastname",
						fr: "Nom du contact",
					},
					required: false,
				},
				{
					name: "firstname",
					type: "text",
					label: {
						en: "Contact Firstname",
						fr: "Prénom du contact",
					},
					required: false,
				},
				{
					name: "email",
					type: "email",
					label: {
						en: "Contact Email",
						fr: "Email du contact",
					},
					required: false,
				},
				{
					name: "phone",
					type: "text",
					label: {
						en: "Contact Phone",
						fr: "Téléphone du contact",
					},
					required: false,
				},
			],
		},
		{
			name: "connexion",
			type: "group",
			label: {
				en: "Connexion",
				fr: "Connexion",
			},
			fields: [
				{
					name: "id",
					type: "text",
					label: {
						en: "Id",
						fr: "Id",
					},
					required: false,
				},
				{
					name: "password",
					type: "text",
					label: {
						en: "Password",
						fr: "Mot de passe",
					},
					required: false,
				},
			],
		},
		{
			name: "other_information",
			type: "group",
			label: {
				en: "Other Information",
				fr: "Autres informations",
			},
			fields: [
				{
					name: "theme",
					type: "text",
					label: {
						en: "Theme",
						fr: "Thématique",
					},
					required: false,
				},
				{
					name: "subscription_fee",
					type: "text",
					label: {
						en: "Subscription Fee",
						fr: "Frais de souscription",
					},
					required: false,
				},
				{
					name: "duration",
					type: "text",
					label: {
						en: "Duration",
						fr: "Durée",
					},
					required: false,
				},
				{
					name: "rentability",
					type: "text",
					label: {
						en: "Rentability",
						fr: "Rentabilité",
					},
					required: false,
				},
				{
					name: "rentability_n1",
					type: "text",
					label: {
						en: "Rentability N1",
						fr: "Rentabilité N1",
					},
					required: false,
				},
				{
					name: "commission",
					type: "text",
					label: {
						en: "Commission",
						fr: "Commission",
					},
					required: false,
				},
				{
					name: "commission_public_offer",
					type: "text",
					label: {
						en: "Commision public offer",
						fr: "Commission pour l'offre publique",
					},
					required: false,
				},
				{
					name: "commission_offer_group_valorem",
					type: "text",
					label: {
						en: "Commission offer Groupe Valorem",
						fr: "Commission pour l'offre Groupe Valorem",
					},
					required: false,
				},
				{
					name: "scpi",
					type: "text",
					label: {
						en: "SCPI",
						fr: "SCPI",
					},
					required: false,
				},
			],
		},
	],
};
