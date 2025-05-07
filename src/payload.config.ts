import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { en } from "@payloadcms/translations/languages/en";
import { openapi, swaggerUI } from "payload-oapi";
import { buildConfig } from "payload";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import sharp from "sharp";
import path from "path";

import { SupplierCategories } from "./collections/supplier-categories";
import { ContactCategories } from "./collections/contact-categories";
import { websocketServerPlugin } from "./plugins/websocket-server";
import { SupplierProducts } from "./collections/supplier-products";
import { customTranslations } from "./utils/custom-translations";
import { Reservations } from "./collections/reservations";
import { AgencyLife } from "./collections/agency-life";
import { Signatures } from "./collections/signatures";
import { ChatRooms } from "./collections/chat-rooms";
import { Suppliers } from "./collections/suppliers";
import { AppUsers } from "./collections/app-users";
import { Messages } from "./collections/messages";
import { Fundesys } from "./collections/fundesys";
import { Contacts } from "./collections/contacts";
import { Fidnet } from "./collections/fidnet";
import { Admins } from "./collections/admins";
import { Media } from "./collections/media";


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	serverURL:
		process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_SERVER_URL,
	cors: ["*"],
	// cors: {
		// Add your allowed origin here
		// origins: ["http://192.168.1.230:8081"],
		// methods: ['GET', 'POST', 'PUT', 'DELETE'],
		// headers: ["Content-Type", "Authorization", "Accept"],
	// },
	csrf: [
		// Add your allowed origins here for CSRF protection
		// "simply-life-app://mobile",
		// "http://localhost:3000",
	],
	localization: {
		locales: ["fr", "en"],
		defaultLocale: "fr",
	},
	admin: {				
		// you can change the binded routes in admin
		// routes: {
		// },
		autoLogin:
			process.env.NODE_ENV === "development"
				? {
						email: "anodevfr@gmail.com",
						password: "..............",
						prefillOnly: true,
					}
				: false,
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
				Logo: "/components/logo.tsx",
				Icon: "/components/logo.tsx",
			},
		},
		
		meta: {
			title: "Simply Life Administration",
			description: "Administration pour l'application mobile Simply Life",
			icons: [
				{
					rel: "icon",
					type: "image/png",
					url: "/favicon.ico",
				},
				{
					rel: "apple-touch-icon",
					type: "image/png",
					url: "/favicon.ico",
				},
			],
		},
	},
	// binded routes from dashboard and api
	routes: {
		admin: "/admin",
		api: "/api",
	},
	i18n: customTranslations,
	collections: [
		Admins,
		SupplierCategories,
		Contacts,
		Fidnet,
		Suppliers,
		Fundesys,
		Media,
		Reservations,
		SupplierProducts,
		ContactCategories,
		AppUsers,
		AgencyLife,
		ChatRooms,
		Messages,
		Signatures,
	],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	// db: postgresAdapter({
	// 	idType: "uuid",
	// 	pool: {
	// 		connectionString: process.env.DATABASE_URI || "",
	// 	},
	// }),
	db: vercelPostgresAdapter({
		// create table for database that is not handled by payload
		// beforeSchemaInit: [
		// 	({ schema, adapter }) => {
		// 		return {
		// 			...schema,
		// 			tables: {
		// 				...schema.tables,
		// 				addedTable: pgTable('added_table', {
		// 					// id: serial('id').notNull(),
		// 					id: uuid('id').defaultRandom().primaryKey(),
		// 				}),
		// 			},
		// 		}
		// 	},
		// ],
		
		idType: "uuid",
		pool: {
			connectionString: process.env.DATABASE_URI || ""
		},
	}),
	sharp,
	email: process.env.NODE_ENV === "production" ? undefined : nodemailerAdapter({
		defaultFromAddress: "info@simply-life.fr",
		defaultFromName: "Simply Life",
		transport: nodemailer.createTransport({
			host: "127.0.0.1",
			port: 1025,
			ignoreTLS: true, // Add this for MailHog
			
		}),
	}),
	plugins: [
		websocketServerPlugin({
			collections: ["messages"],
		}),
		payloadCloudPlugin({
			// storage: false,
			// email: false,
			// uploadCaching: false,
		}),
		openapi({ openapiVersion: "3.0", metadata: { title: "SIMPLY LIFE API", version: "1.0.0" } }),
		swaggerUI({}),
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
