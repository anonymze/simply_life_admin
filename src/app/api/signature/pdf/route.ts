import { jsonResponseBadRequest, jsonResponsePost } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { NextRequest } from "next/server";
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "multipart/form-data";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	file: z.string(),
});

export async function POST(req: NextRequest) {
	const { error, messageError, data } = await validateRequest(
		req,
		ACCEPTED_CONTENT_TYPE,
		mediaSchema,
	);

	if (error) return jsonResponseBadRequest(messageError);

	const { file } = data;

	console.log(file);

	return jsonResponsePost({ message: "Hello from Payload CMS!" });
}
