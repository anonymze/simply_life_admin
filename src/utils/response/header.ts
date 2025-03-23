export function getResponseHeader(getCookieApiToken: boolean) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");

	return headers;
}
