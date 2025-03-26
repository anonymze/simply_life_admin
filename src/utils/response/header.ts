import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";


export function createResponseHeader(getCookieApiToken: boolean) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	return headers;
}

/**
 * @description Check if the token is valid with Payload CMS
 */
export async function isValidToken(cookies: RequestCookies) {
	const token = cookies.get("payload-token");
	if (!token) return false;

	try {
		const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify/${token.value}`, {
			method: "POST", 
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const data = await req.json();

		console.log('ici')
		console.log(data)
		return true;
	} catch (err) {
		return false;
	}

	return true;
}
