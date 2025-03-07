import { PayloadRequest } from "payload";

import type { AppUser } from "../payload-types";


const ORIGIN_MOBILE = "https://simplylife.app/mb";
const ORIGIN_APP = "https://simplylife.app/app";
type originType = "mobile" | "app";

export const canAccessApi = (req: PayloadRequest, roles: AppUser["role"][], originType?: originType): boolean => {
	if (!req.user) return false;
	if (req.user.collection === "admins") return true;
	if (originType && !verifyOrigin(req.headers?.get("origin"), originType)) return false;

	return roles.includes(req.user.role);
};

const verifyOrigin = (origin: string | null, originType: originType): boolean => {
	if (!origin) return false;
	return originType === "mobile" ? origin === ORIGIN_MOBILE : origin === ORIGIN_APP;
};
