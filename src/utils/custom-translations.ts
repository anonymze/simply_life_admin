import type { DefaultTranslationsObject, I18nOptions } from "@payloadcms/translations";
import { fr } from "@payloadcms/translations/languages/fr";
import { en } from "@payloadcms/translations/languages/en";


export const customTranslations = {
	fallbackLanguage: "fr",
	supportedLanguages: { fr, en },
	translations: {
		en: {
			custom: {
				errorlengthPassword: "The password must contain at least 10 characters.",
				errorLettersPassword: "The password must contain at least one letter.",
				errorNumbersPassword: "The password must contain at least one number.",
				textBeforeLogin:
					"Welcome to the Simply Life administration. Simplify your employees daily lives simply and effectively.",
			},
			general: {
				createNew: "Create a new item",
				createNewLabel: "Create a new item",
			},
			'app-users': {
				createNewUser: "Create a new app user",
				labelRole: "Role",	
				associate: "Associate",
				employee: "Employee",
				independent: "Independent",
				visitor: "Visitor",
			},
		},
		fr: {
			custom: {
				errorlengthPassword: "Le mot de passe doit contenir au moins 10 caractères.",
				errorLettersPassword: "Le mot de passe doit contenir au moins une lettre.",
				errorNumbersPassword: "Le mot de passe doit contenir au moins un chiffre.",
				textBeforeLogin:
					"Bienvenue sur l'administration de Simply Life. Simplifiez le quotidien de vos employées de manière simple et efficace.",
			},
			general: {
				createNew: "Créer un nouvel élément",
				createNewLabel: "Créer un nouvel élément",
			},
			'app-users': {
				createNewUser: "Création d'un nouvel utilisateur",
				labelRole: "Rôle",
				associate: "Associé",
				employee: "Employé",
				independent: "Indépendant",
				visitor: "Visiteur",
			},
		},
	},
} as I18nOptions<{} | DefaultTranslationsObject>;

// export type CustomTranslationsObject = typeof customTranslations.en &
//   typeof enTranslations
// export type CustomTranslationsKeys =
//   NestedKeysStripped<CustomTranslationsObject>