import { ValidationError, type CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";


export const Contacts: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "contacts",
	labels: {
		singular: {
			en: "Contact",
			fr: "Contact",
		},
		plural: {
			en: "Contacts",
			fr: "Contacts",
		},
	},
	admin: {
		useAsTitle: "name",
		group: {
			en: "Contacts map",
			fr: "Carte des contacts",
		},
	},
	hooks: {
		beforeValidate: [
			async ({ data, operation }) => {
				if (operation !== "create") return;

				if (!data?.latitude || !data?.longitude) {
					throw new ValidationError({
						errors: [
							{
								message: `Veuillez entrer et SÉLECTIONNER une adresse.`,
								label: `Veuillez entrer et SÉLECTIONNER une adresse.`,
								path: "address",
							},
						],
					});
				}

				return;
			},
		],
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: {
				en: "Contact name",
				fr: "Nom du contact",
			},
		},
		{
			name: "category",
			type: "relationship",
			required: true,
			relationTo: "contact-categories",
			label: {
				en: "Category",
				fr: "Catégorie",
			},
		},
		{
			name: "specialisation",
			type: "text",
			required: false,
			label: {
				en: "Specialisation",
				fr: "Specialisations",
			},
			admin: {
				description: "Séparer les spécialisations par des virgules.",
			}
		},
		{
			name: "address",
			type: "ui",
			label: {
				en: "Address",
				fr: "Adresse",
			},
			admin: {
				disableListColumn: true,
				components: {
					Field: "/components/google-adress.tsx",
				},
			},
		},
		{
			name: "phone",
			type: "text",
			label: {
				en: "Phone",
				fr: "Téléphone",
			},
			required: false,
		},
		{
			name: "website",
			type: "text",
			label: {
				en: "Website",
				fr: "Site internet",
			},
			required: false,
		},

		{
			admin: {
				hidden: true,
				disableBulkEdit: true,
				disableListColumn: false,
			},
			name: "latitude",
			type: "text",
			label: {
				en: "Latitude",
				fr: "Latitude",
			},
			required: true,
		},
		{
			admin: {
				hidden: true,
				disableBulkEdit: true,
				disableListColumn: false,
			},
			name: "longitude",
			type: "text",
			label: {
				en: "Longitude",
				fr: "Longitude",
			},
			required: true,
		},
	],
};
