import { jsonResponseBadRequest, jsonResponsePost } from "@/utils/response/response";
import { validateRequest } from "@/utils/request/validate";
import { NextRequest } from "next/server";
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "multipart/form-data";

const mediaSchema = z.object({
	media: z.instanceof(File),
});

export async function POST(req: NextRequest) {
	const { error, messageError, data } = await validateRequest(
		req,
		ACCEPTED_CONTENT_TYPE,
		mediaSchema,
	);

	if (error) return jsonResponseBadRequest(messageError);

	const { media } = data;

	return jsonResponsePost({ message: "Hello from Payload CMS!" });
}
