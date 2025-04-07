import { headersWithCors, type CollectionConfig } from "payload";
import { z } from "zod";


const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	files: z.array(z.string()).min(1),
});

export const Signatures: CollectionConfig = {
	admin: {
		hidden: true,
	},
	access: {
		read: () => false,
		create: () => false,
		update: () => false,
		delete: () => false,
	},
	slug: "signatures",
	// endpoints: false,
	endpoints: [
		{
			path: "/pdf",
			method: "post",
			handler: async (req) => {
				// data are not added to the req, you have to add everything one by one + custom endpoints don't handle CORS headers in responses too

				// await addLocalesToRequestFromData(req)
				// i don't use it because it uses file key automatically
				// await addDataAndFileToRequest(req);

				try {
					const data = await req.json?.();

					if (!data || mediaSchema.safeParse(data).error) {
						return new Response("KO", { status: 400 });
					}

					console.log(data);

					// await req.payload.update({
					// 	collection: "signatures",
					// 	data: {},
					// });

					return new Response("OK");
				} catch (error) {
					console.log(error);
					return new Response("KO", { status: 400 });
				}
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
			name: "file",
			type: "upload",
			relationTo: "media",
			required: true,
		},
	],
};
