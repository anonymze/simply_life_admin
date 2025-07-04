import { canAccessApi, validatePassword } from "@/utils/helper";
import { CollectionConfig } from "payload";

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
    group: {
      en: "Users",
      fr: "Utilisateurs",
    },
    // defaultColumns: ["name", "range", "price", "priceType", "threshold"],
    useAsTitle: "email",
  },
  // email and password added by default

  auth: {
    useAPIKey: true,
    maxLoginAttempts: 4,
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    cookies: {
      secure: true,
      sameSite: "None",
      domain: "https://localhost:3000",
    },
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
    {
      name: "description-below-password",
      type: "ui",
      admin: {
        components: {
          Field: "/components/description-below-password.tsx",
        },
      },
    },
    // {
    // 	name: "actions",
    // 	type: "ui",
    // 	admin: {
    // 		position: "sidebar",
    // 		components: {
    // 			Field: "/components/custom-client-field.tsx",
    // 		},
    // 	},
    // },
    // {
    // 	name: "serverActions",
    // 	type: "ui",
    // 	admin: {
    // 		position: "sidebar",
    // 		components: {
    // 			Field: "/components/custom-server-field.tsx",
    // 		},
    // 	},
    // },
  ],
};
