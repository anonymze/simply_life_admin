import type { CollectionConfig } from "payload";

import { canAccessApi, validateMedia } from "../utils/helper";


export const Commissions: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "commissions",
	admin: {
		group: {
			en: "Commissions",
			fr: "Commissions",
		},
	},
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			label: {
				en: "Employee concerned",
				fr: "Employé concerné",
			},
			required: true,
			hasMany: false,
		},
		{
			name: "supplier",
			type: "relationship",
			relationTo: "suppliers",
			label: {
				en: "Supplier",
				fr: "Fournisseur",
			},
			required: true,
			hasMany: false,
		},
		{
			name: "structured_product",
			type: "checkbox",
			label: {
				en: "Structured product",
				fr: "Produit structuré",
			},
			required: false,
		},
		{
			name: "informations",
			type: "group",
			admin: {
				condition: (data) => {
					return !!data?.supplier;
				},
			},
			label: {
				en: "Commission Details",
				fr: "Informations de commission",
			},
			fields: [
				{
					name: "date",
					type: "date",
					// defaultValue: new Date(),
					admin: {
						date: {
							displayFormat: "MM/yyyy",
							pickerAppearance: "monthOnly",
						},	
					},
					label: {
						en: "Date of commission",
						fr: "Date de commission",
					},
					required: false,
				},
				{
					name: "encours",
					type: "number",

					admin: {
						step: 0.01,
						condition: (data) => {
							return !data.structured_product;
						},
					},

					label: {
						en: "Encours",
						fr: "Encours",
					},
					required: false,
				},
				{
					name: "production",
					type: "number",
					admin: {
						step: 0.01,
						condition: (data) => {
							return !data.structured_product;
						},
					},
					label: {
						en: "Production",
						fr: "Production",
					},
					required: false,
				},
				{
					name: "pdf",
					type: "upload",
					relationTo: "media",
					admin: {
						condition: (data) => {
							return !data.structured_product;
						},
					},
					label: {
						en: "Commission PDF",
						fr: "Fichier de commission en PDF",
					},
					// @ts-expect-error
					validate: (data) => {
						return validateMedia(data, "application/pdf");
					},
					required: false,
				},
				{
					name: "title",
					type: "text",
					admin: {
						condition: (data) => {

							console.log(data)
							return data.structured_product;
						},
					},
					label: {
						en: "Title",
						fr: "Titre",
					},
					required: false,
				},
				{
					name: "up_front",
					type: "number",

					admin: {
						step: 0.01,
						condition: (data) => {
							return data.structured_product;
						},
					},
					label: {
						en: "Amount (up-front)",
						fr: "Montant (up-front)",
					},
					required: false,
				},				{
					name: "broqueur",
					type: "text",

					admin: {
						condition: (data) => {
							return data.structured_product;
						},
					},
					label: {
						en: "Broqueur",
						fr: "Broqueur",
					},
					required: false,
				}
			],
		},
	],
};
