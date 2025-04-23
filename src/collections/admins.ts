import { ValidationError, type CollectionBeforeValidateHook, type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


/**
 * Throws error if password strength is not met. Password must have:
 *  - 8 or more characters
 *  - uppercase and lowercase letters
 *  - at least one symbol
**/
const validatePassword: CollectionBeforeValidateHook = (data) => {
	console.log(data.data);
	// const { password } = data?.data;
	// console.log("hihihihi");
  // let message= "looool";
  // if (password.length <= 8) message = 'Password must be at least 8 characters long';

  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // if (!hasUpperCase || !hasLowerCase) message = 'Password must have both uppercase and lowercase letters')

  // const hasSymbols = /[$-/:-?{-~!"^_`\[\]]/.test(password);
  // if (!hasSymbols) message = 'Password must include at least one symbol.'

 throw new ValidationError({errors: [{message: "looool", label: "password??!!", path: "password!!!!"}]});
};

export const Admins: CollectionConfig = {
	slug: "admins",
	access: {
		read: ({ req }) => canAccessApi(req, []),
		create: ({ req }) => canAccessApi(req, []),
		update: ({ req }) => canAccessApi(req, []),
		delete: ({ req }) => canAccessApi(req, []),
	},
	labels: {
		singular: {
			en: "Admin",
			fr: "Administrateur",
		},
		plural: {
			en: "Admins",
			fr: "Administrateurs",
		},
	},
	admin: {
		useAsTitle: "email",
	},
	// email and password added by default
	auth: {
		maxLoginAttempts: 3,
		tokenExpiration: 60 * 60 * 24 * 30, // 30 days
	},
	hooks: {
    beforeValidate: [validatePassword],
  },
	fields: [
		{
			name: "fullname",
			type: "text",
			required: true,
			label: {
				en: "Full name",
				fr: "Nom complet",
			},
		},
	],
};

