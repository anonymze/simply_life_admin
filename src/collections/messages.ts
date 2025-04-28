import { jsonResponse } from "@/utils/response/json";
import type { CollectionConfig } from "payload";
import { z } from "zod";

import { canAccessApi } from "../utils/helper";


export const Messages: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	slug: "messages",
	// defaultPopulate: {
	// 	app_user: true,
	// },
	// forceSelect: {
	// 	app_user: true,
	// },
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			// maxDepth: 2,
			hasMany: false,
			filterOptions: () => {
				return true;
			},
			// prevent admin interface from modifying this value
			// admin: {
			// 	readOnly: true,
			// },
		},
		{
			name: "chat_room",
			type: "relationship",
			// only id for now
			maxDepth: 0,
			relationTo: "chat-rooms",
			hasMany: false,
			required: true,
		},
		{
			name: "message",
			type: "text",
			label: {
				en: "Message",
				fr: "Message",
			},
			required: true,
		},
	],
	endpoints: [
		{
			method: "get",
			path: "/by-room",
			handler: async (req) => {
				if (!canAccessApi(req, ["associate", "employee", "independent", "visitor"])) {
					return Response.json(
						{
							errors: [
								{
									message: "Vous n’êtes pas autorisé à effectuer cette action.",
								},
							],
						},
						{
							status: 403,
						}
					);
				}

				const query = optionalQuerySchema.parse(req.query);

				const results = await req.payload.find({
					collection: "messages",
					where: {
						chat_room: {
							equals: query.where?.chat_room?.equals,
						},
					},
					sort: query.sort,
					limit: query.limit,
				});

				return Response.json(results);
			},
		},
	],
};

const optionalQuerySchema = z.object({
	where: z
		.object({
			chat_room: z.object({
				equals: z.string(),
			}).optional(),
		})
		.optional(),
	sort: z.string().optional(),
	limit: z.string().optional().transform((val) => parseInt(val ?? "10")),
});
