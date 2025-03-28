import { jsonResponseBadRequest, jsonResponsePost, jsonResponseUnauthorized } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { isValidToken } from "@/utils/response/header";
import { NextRequest } from "next/server";
import { writeFileSync } from 'fs';
import { join } from 'path';
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "application/json";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	files: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
	console.log(req.cookies.getAll())
	const { error, messageError, data } = await validateRequest(req, ACCEPTED_CONTENT_TYPE, mediaSchema);

	if (error) return jsonResponseBadRequest(messageError);

	console.log(data.files)

	return jsonResponsePost({ message: "OK" });
}
