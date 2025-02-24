import type { AppUser, Config } from "../payload-types";


export const canAccessApi = (user: Config["user"] | null, roles: AppUser["role"][]): boolean => {
	if (!user) return false;
	if (user.collection === "admins") return true;
	return roles.includes(user.role);
};