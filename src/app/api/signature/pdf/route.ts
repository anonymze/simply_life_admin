import { jsonResponseBadRequest, jsonResponsePost } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { NextRequest } from "next/server";
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "application/x-www-form-urlencoded";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	files: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
	const { error, messageError, data } = await validateRequest(req, ACCEPTED_CONTENT_TYPE, mediaSchema);

	if (error) {
		console.log(messageError);
		return jsonResponseBadRequest(messageError);
	}

	console.log(data);

	return jsonResponsePost({ message: "Hello from Payload CMS!" });
}
