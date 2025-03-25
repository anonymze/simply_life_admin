import { jsonResponseBadRequest, jsonResponsePost } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { NextRequest } from "next/server";
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "application/json";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	file: z.array(z.string()),
});

export async function POST(req: NextRequest) {
	console.log("hihihihihi");
	console.log(req.body);
	console.dir(req, { depth: null });
	const ki = await req.json();
	console.log(ki);
	const { error, messageError, data } = await validateRequest(req, ACCEPTED_CONTENT_TYPE, mediaSchema);

	console.log("data", data);

	if (error) {
		console.log("error", messageError);
		return jsonResponseBadRequest(messageError);
	}

	const { file } = data;

	console.log(file);

	return jsonResponsePost({ message: "Hello from Payload CMS!" });
}
