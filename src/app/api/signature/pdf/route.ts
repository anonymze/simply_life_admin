import { jsonResponseBadRequest, jsonResponsePost, jsonResponseUnauthorized } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { NextRequest } from "next/server";
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "application/x-www-form-urlencoded";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	files: z.array(z.string()).min(1),
	jwt: z.string(),
});

export async function POST(req: NextRequest) {
	const { error, messageError, data } = await validateRequest(req, ACCEPTED_CONTENT_TYPE, mediaSchema);

	if (error) {
		console.log(messageError);
		return jsonResponseBadRequest(messageError);
	}

	try {
		console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify/${data.jwt}`);
		const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify/${data.jwt}`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const test = await request.json();

		console.log("ici");
		console.log(test);
	} catch (err) {}

	return jsonResponsePost({ message: "Hello from Payload CMS!" });
}
