import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { en } from "@payloadcms/translations/languages/en";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import path from "path";

import { Sponsors } from "./collections/Sponsors";
import { AppUsers } from "./collections/AppUsers";
import { Admins } from "./collections/Admins";
import { Media } from "./collections/Media";


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	// serverURL: "https://simply-life-admin.vercel.app",
	// csrf: [
  //   // whitelist of domains to allow cookie auth from
	// ],
	admin: {
		avatar: {
			Component: "/components/settings.tsx",
		},
		user: Admins.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		components: {
			beforeLogin: ["/components/before-login.tsx"],
			logout: {
				Button: "/components/logout.tsx",
			},
			graphics: {
				Icon: "/components/logo.tsx",
				Logo: "/components/logo.tsx",
			},
		},
		meta: {
			title: "Simply Life Administration",
			description: "Administration pour l'application mobile Simply Life",
			icons: [
				{
					rel: "icon",
					type: "image/png",
					url: "/favicon.png",
				},
				{
					rel: "apple-touch-icon",
					type: "image/png",
					url: "/favicon.png",
				},
			],
		},
	},
	routes: {
		admin: "/admin",
	},
	i18n: {
		fallbackLanguage: "fr",
		supportedLanguages: { fr, en },
		translations: {
			en: {
				custom: {
					textBeforeLogin:
						"Welcome to the Simply Life administration. Manage your professional players easily and efficiently.",
				},
			},
			fr: {
				custom: {
					textBeforeLogin:
						"Bienvenue sur l'administration de Simply Life. Gérer vos joueurs professionnels de manière simple et efficace.",
				},
				general: {
					createNew: "Créer un nouvel élément",
					createNewLabel: "Créer un nouvel élément",
				},
			},
		},
	},
	collections: [Admins, Media, AppUsers, Sponsors],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		idType: "uuid",
		pool: {
			connectionString: process.env.DATABASE_URI || "",
		},
	}),
	sharp,
	plugins: [
		payloadCloudPlugin(),
		
		vercelBlobStorage({
			enabled: true, // Optional, defaults to true
			// Specify which collections should use Vercel Blob
			collections: {
				media: {
					disableLocalStorage: true,
					prefix: "media-simply-life",
				},
			},
			// Token provided by Vercel once Blob storage is added to your Vercel project
			token: process.env.BLOB_READ_WRITE_TOKEN,
		}),
	],
});
