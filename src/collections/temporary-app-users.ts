import { canAccessApi, rolesOptions } from "@/utils/helper";
import { type CollectionConfig } from "payload";

export const TemporaryAppUsers: CollectionConfig = {
  slug: "temporary-app-users",
  access: {
    read: ({ req }) => canAccessApi(req, []),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "role",
      type: "select",
      enumName: "enum_app_users_role",
      required: true,
      options: rolesOptions,
    },
    {
      name: "apple_store_code",
      type: "text",
      required: false,
      unique: true,
      admin: {
        description:
          "Si l'utilisteur utilise un iPhone (Apple), renseignez un code de téléchargement unique ici. Il recevra une notice explicative sur le téléchargement dans le mail d'inscription.",
      },
    },
  ],
};
