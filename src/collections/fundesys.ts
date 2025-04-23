import { getPayload, type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";
import config from "@payload-config";


export const Fundesys: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "fundesys",
	fields: [
		{
			name: "date",
			type: "date",
			label: {
				en: "Date",
				fr: "Date",
			},
			required: true,
		},
		{
			name: "file",
			type: "upload",
			relationTo: "media",
			// @ts-expect-error
			validate: async (data: string) => {
				const payload = await getPayload({
					config,
				});
				const file = await payload.findByID({
					collection: "media",
					id: data,
				});

				if (file.mimeType !== "application/pdf") return "Le fichier doit être au format PDF.";
			},
			label: {
				en: "File",
				fr: "Fichier",
			},
			required: true,
		},
		{
			name: "video",
			type: "upload",
			relationTo: "media",
			label: {
				en: "Video",
				fr: "Vidéo",
			},
			// @ts-expect-error
			validate: async (data: string) => {
				const payload = await getPayload({
					config,
				});
				const file = await payload.findByID({
					collection: "media",
					id: data,
				});

				if (file.mimeType?.startsWith("video/") === false) return "Le fichier doit être une vidéo.";
			},
			required: true,
		},
	],
};
