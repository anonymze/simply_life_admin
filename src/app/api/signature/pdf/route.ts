import { jsonResponseBadRequest, jsonResponsePost, jsonResponseUnauthorized } from "@/utils/response/json";
import { validateRequest } from "@/utils/request/validation";
import { isValidToken } from "@/utils/response/header";
import { NextRequest } from "next/server";
import { writeFileSync } from 'fs';
import { join } from 'path';
import { z } from "zod";


const ACCEPTED_CONTENT_TYPE = "application/x-www-form-urlencoded";

const mediaSchema = z.object({
	// IT'S BASE64 FOR NOW
	files: z.array(z.string()).min(1),
	jwt: z.string(),
});

export async function POST(req: NextRequest) {
	return jsonResponsePost({ message: "OK" });
}
