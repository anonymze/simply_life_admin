import { canAccessApi } from "@/utils/helper";
import type { CollectionConfig } from "payload";

export const AgencyLifeStatus: CollectionConfig = {
  slug: "agency-life-status",
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  admin: {
    hidden: true,
  },
  labels: {
    singular: {
      en: "Agency Life Event Status",
      fr: "Évènement Groupe Valorem statut",
    },
    plural: {
      en: "Agency Life Event Status",
      fr: "Évènement Groupe Valorem statutt",
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
    },
    {
      name: "agency_life",
      type: "relationship",
      relationTo: "agency-life",
      label: {
        en: "Agency Life",
        fr: "Groupe Valorem",
      },
      required: true,
      hasMany: false,
    },
    {
      name: "status",
      type: "select",
      options: [
        {
          label: {
            en: "Yes",
            fr: "Oui",
          },
          value: "yes",
        },
        {
          label: {
            en: "No",
            fr: "Non",
          },
          value: "no",
        },
      ],
      required: true,
    },
  ],
};
