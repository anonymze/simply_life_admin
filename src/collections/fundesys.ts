import { type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


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
			required: true,
		},
	],
};
