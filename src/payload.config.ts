import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import nodemailer from "nodemailer";
import path from "path";
import { buildConfig } from "payload";
import { openapi, swaggerUI } from "payload-oapi";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Admins } from "./collections/admins";
import { AgencyLife } from "./collections/agency-life";
import { AppUsers } from "./collections/app-users";
import { AppUsersCommissionsCode } from "./collections/app-users-commissions-code";
import { ChatRooms } from "./collections/chat-rooms";
import { CommissionImports } from "./collections/commission-imports";
import { Commissions } from "./collections/commissions";
import { ContactCategories } from "./collections/contact-categories";
import { Contacts } from "./collections/contacts";
import { Fidnet } from "./collections/fidnet";
import { Fundesys } from "./collections/fundesys";
import { Media } from "./collections/media";
import { Messages } from "./collections/messages";
import { Reservations } from "./collections/reservations";
import { Signatures } from "./collections/signatures";
import { Sports } from "./collections/sports";
import { Structured } from "./collections/structured";
import { SupplierCategories } from "./collections/supplier-categories";
import { SupplierProducts } from "./collections/supplier-products";
import { Suppliers } from "./collections/suppliers";
import { SupplierCommissionsColumn } from "./collections/suppliers-commissions-column";
import { TemporaryAppUsers } from "./collections/temporary-app-users";
import { websocketServerPlugin } from "./plugins/websocket-server";
import { customTranslations } from "./utils/custom-translations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  upload: {
    limits: {
      fileSize: 40000000, // 40MB, written in bytes
    },
  },
  serverURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_SERVER_URL,
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
    // "https://localhost:3000",
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
    Commissions,
    Media,
    Reservations,
    SupplierProducts,
    ContactCategories,
    AppUsers,
    AppUsersCommissionsCode,
    SupplierCommissionsColumn,
    AgencyLife,
    ChatRooms,
    Messages,
    Structured,
    Sports,
    Signatures,
    TemporaryAppUsers,
    CommissionImports,
  ],
  // globals: [CommissionImports],
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
      connectionString: process.env.DATABASE_URI || "",
    },
    // Add hooks after schema initialization
    afterSchemaInit: [
      async ({ schema }) => {
        const relations = ["relations_messages"];

        // console.log(schema.relations);

        relations.forEach((relation) => {
          const index = Symbol.for(`drizzle:PgInlineForeignKeys`);
          // console.log(index);
          //@ts-expect-error workaround
          const fkeys = schema.relations[relation].table[index];
          // Loop through the foreign keys and modify them
          //@ts-expect-error workaround
          fkeys.forEach((foreignKey) => {
            foreignKey.onDelete = "CASCADE";
            foreignKey.onUpdate = "CASCADE";
          });
        });
        return schema;
      },
    ],
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER || "",
    defaultFromName: "Simply Life",
    transport: nodemailer.createTransport({
      host:
        process.env.NODE_ENV === "production"
          ? process.env.SMTP_HOST // OVH SMTP server<
          : "127.0.0.1",
      port:
        process.env.NODE_ENV === "production"
          ? 587 // OVH SMTP port
          : 1025,
      secure: false, // false for 587 (STARTTLS)
      auth: {
        user:
          process.env.NODE_ENV === "production"
            ? process.env.SMTP_USER
            : "user",
        pass:
          process.env.NODE_ENV === "production"
            ? process.env.SMTP_PASS
            : "pass",
      },
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
    openapi({
      openapiVersion: "3.0",
      metadata: { title: "SIMPLY LIFE API", version: "1.0.0" },
    }),
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
