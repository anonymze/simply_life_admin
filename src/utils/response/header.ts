import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";


export function createResponseHeader(getCookieApiToken: boolean) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	return headers;
}

export async function isValidToken(cookies: RequestCookies) {
	const token = cookies.get("payload-token");

	if (!token) return false;

	return true;
}