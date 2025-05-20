import type { CollectionConfig } from "payload";
import { z } from "zod";

import { canAccessApi, generateImageBlurHash, generateVideoBlurHash, validateMedia } from "../utils/helper";


export const Commissions: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "commissions",
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
					admin: {
						condition: (data) => {
							return data.supplier === "049a54ce-43bf-4ba8-9741-ae67f0e0f407";
						},
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
							return data.supplier === "049a54ce-43bf-4ba8-9741-ae67f0e0f407";
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
							return data.supplier === "049a54ce-43bf-4ba8-9741-ae67f0e0f407";
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
							return data.supplier !== "049a54ce-43bf-4ba8-9741-ae67f0e0f407";
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
					hooks: {
						afterChange: [
							async ({ value, siblingData, req }) => {
								if (value) {
								
								}
								return value;
							}
						]
					}
				},
				{
					name: "excel",
					type: "upload",
					relationTo: "media",
					admin: {
						condition: (data) => {
							return data.supplier !== "049a54ce-43bf-4ba8-9741-ae67f0e0f407";
						},
					},
					label: {
						en: "Commission Excel",
						fr: "Fichier de commission en Excel",
					},
					// @ts-expect-error
					validate: (data) => {
						return validateMedia(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
					},
					required: false,
				},
			],
		},
	],
};
