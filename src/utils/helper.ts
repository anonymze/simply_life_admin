import { CollectionBeforeValidateHook, PayloadRequest, ValidationError } from "payload";

import type { AppUser } from "../payload-types";


const ORIGIN_MOBILE = "simply-life-app://mobile";
const ORIGIN_APP = "simply-life-app://app";
type originType = "mobile" | "app";

export const canAccessApi = (req: PayloadRequest, roles: AppUser["role"][], originType?: originType): boolean => {
	if (!req.user) return false;
	if (req.user.collection === "admins") return true;
	// console.log(req.headers.get("cookie"));
	if (originType && !verifyOrigin(req.headers?.get("origin"), originType)) return false;

	return roles.includes(req.user.role);
};

const verifyOrigin = (origin: string | null, originType: originType): boolean => {
	if (!origin) return false;
	return originType === "mobile" ? origin === ORIGIN_MOBILE : origin === ORIGIN_APP;
};

const messageErrorAuth = {
	length: {
		en: "The password must contain at least 10 characters.",
		fr: "Le mot de passe doit contenir au moins 10 caractères.",
	},
	uppercase: {
		en: "The password must contain at least one lowercase letter and one uppercase letter.",
		fr: "Le mot de passe doit contenir au moins une lettre minuscule et une lettre majuscule.",
	},	
}

/**
 * Throws error if password strength is not met. Password must have:
 *  - 8 or more characters
 *  - uppercase and lowercase letters
**/
export const validatePassword: CollectionBeforeValidateHook = (payloadRequest) => {
	const { data } = payloadRequest;
	if (!data?.password) return;

	const locale = payloadRequest.req.locale === "fr" ? "fr" : "en";

  if (data.password.length < 10)  throw new ValidationError({errors: [{message: messageErrorAuth.length[locale], label: messageErrorAuth.length[locale], path: "password"}]});

  const hasUpperCase = /[A-Z]/.test(data.password);
  const hasLowerCase = /[a-z]/.test(data.password);
  if (!hasUpperCase || !hasLowerCase) throw new ValidationError({errors: [{message: messageErrorAuth.uppercase[locale], label: messageErrorAuth.uppercase[locale], path: "password"}]});
};