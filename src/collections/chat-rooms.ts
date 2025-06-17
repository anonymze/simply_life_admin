import { chat_rooms_rels } from "@/payload-generated-schema";
import { and, eq } from "@payloadcms/db-postgres/drizzle";
import type { CollectionConfig } from "payload";
import { AppUser } from "@/payload-types";

import { canAccessApi } from "../utils/helper";


export const ChatRooms: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		update: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		delete: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
	},
	admin: {
		hidden: true,
	},
	slug: "chat-rooms",
	endpoints: [
		{
			method: "delete",
			path: "/leave/:chatRoomId/:userId",
			handler: async (req) => {
				const { chatRoomId, userId } = req.routeParams as { chatRoomId: string; userId: string };

				if (!chatRoomId || !userId) {
					return Response.json(
						{
							message: "KO",
						},
						{
							status: 500,
						}
					);
				}

				const chatRoom = await req.payload.findByID({
					collection: "chat-rooms",
					id: chatRoomId,
				});

				if ((chatRoom.app_user as AppUser).id === userId) {
					await req.payload.delete({
						collection: "chat-rooms",
						id: chatRoomId,
					});

					return Response.json({
						message: "OK",
					});
				}

				await req.payload.db.drizzle
					.delete(chat_rooms_rels)
					.where(and(eq(chat_rooms_rels.parent, chatRoomId), eq(chat_rooms_rels["app-usersID"], userId)));

				if (!chatRoom.guests.length) {
					req.payload.delete({
						collection: "chat-rooms",
						id: chatRoomId,
					});
				}

				return Response.json({
					message: "OK",
				});
			},
		},
	],
	fields: [
		{
			name: "app_user",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			hasMany: false,
		},
		{
			name: "guests",
			type: "relationship",
			relationTo: "app-users",
			required: true,
			hasMany: true,
			maxDepth: 1,
		},
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
			name: "description",
			type: "text",
			required: false,
		},
		{
			name: "color",
			type: "text",
			required: false,
		},
	],
};
