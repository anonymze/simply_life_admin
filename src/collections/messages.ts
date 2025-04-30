import type { CollectionConfig } from "payload";
import { z } from "zod";

import { canAccessApi, generateImageBlurHash, generateVideoBlurHash } from "../utils/helper";


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
			required: false,
		},
		{
			name: "file",
			type: "upload",
			relationTo: "media",
			hasMany: false,
			required: false,
		},
	],
	hooks: {
		beforeValidate: [
			({ data, operation }) => {
				// only run on create or update
				if (operation !== "create" && operation !== "update") return;

				const hasMessage = !!data?.message && data.message.trim() !== "";
				const hasFile = !!data?.file;

				if (!hasMessage && !hasFile) throw new Error("A message must have either text or a file.");
				if (hasMessage && hasFile) throw new Error("A message cannot have both text and a file.");

				return data;
			},
		],
	},
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
									message: "Vous n'êtes pas autorisé à effectuer cette action.",
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
		{
			method: "post",
			path: "/with-file",
			handler: async (req) => {
				if (!canAccessApi(req, ["associate", "employee", "independent", "visitor"])) {
					return Response.json(
						{
							errors: [
								{
									message: "Vous n'êtes pas autorisé à effectuer cette action.",
								},
							],
						},
						{
							status: 403,
						}
					);
				}

				const formData = await req.formData?.()!;
				const file = formData.get("file") as File | null;
				const app_user = formData.get("app_user") as string | null;
				const chat_room = formData.get("chat_room") as string | null;

				if (!file || !app_user || !chat_room) {
					return Response.json(
						{
							errors: [
								{
									message: "Missing required fields",
								},
							],
						},
						{
							status: 400,
						}
					);
				}

				const fileBuffer = Buffer.from(await file.arrayBuffer());

				const uploadedFile = await req.payload.create({
					collection: "media",
					file: {
						data: fileBuffer,
						size: file.size,
						name: file.name,
						mimetype: file.type,
					},
					data: {
						alt: file.name,
						blurhash: file.type.startsWith("image/")
							? await generateImageBlurHash(fileBuffer)
							: await generateVideoBlurHash(fileBuffer),
					},
				});

				const message = await req.payload.create({
					collection: "messages",
					data: {
						app_user,
						chat_room,
						file: uploadedFile.id,
					},
				});

				return Response.json(message);
			},
		},
	],
};

const optionalQuerySchema = z.object({
	where: z
		.object({
			chat_room: z
				.object({
					equals: z.string(),
				})
				.optional(),
		})
		.optional(),
	sort: z.string().optional(),
	limit: z
		.string()
		.optional()
		.transform((val) => parseInt(val ?? "10")),
});
