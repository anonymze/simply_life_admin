import { canAccessApi } from "@/utils/helper";
import type { CollectionConfig } from "payload";

export const AppUsersCommissionsCode: CollectionConfig = {
  slug: "app-users-commissions-code",
  access: {
    read: ({ req }) => canAccessApi(req, []),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  admin: {
    group: {
      en: "Commissions",
      fr: "Commissions",
    },
    useAsTitle: "app_user",
    hidden: true,
  },
  labels: {
    singular: {
      en: "User / Commission Code",
      fr: "Association utilisateur / code de commission",
    },
    plural: {
      en: "User / Commission Codes",
      fr: "Association utilisateur / codes de commission",
    },
  },
  fields: [
    {
      name: "app_user",
      type: "relationship",
      relationTo: "app-users",
      label: {
        en: "App User",
        fr: "Utilisateur",
      },
      required: true,
      hasMany: false,
      unique: true,
    },
    {
      name: "code",
      type: "array",
      fields: [
        {
          name: "code",
          type: "text",
          label: {
            en: "Commission Code",
            fr: "Code de commission",
          },
          required: true,
          unique: true,
        },
      ],
      label: {
        en: "Commission Code associated to the user",
        fr: "Codes de commission liés à l'utilisateur",
      },
      required: true,
      // unique: true,
      // admin: {
      // 	description: {
      // 		en: "Unique identifier for the commission code",
      // 		fr: "Identifiant unique pour le code de commission",
      // 	},
      // },
    },
  ],
};
