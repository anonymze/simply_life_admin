import { canAccessApi } from "@/utils/helper";
import { type CollectionConfig } from "payload";

export const Sports: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  labels: {
    singular: {
      en: "Sport and patrimoine",
      fr: "Sport et patrimoine",
    },
    plural: {
      en: "Sports and patrimoines",
      fr: "Sports et patrimoines",
    },
  },
  slug: "sports",
  fields: [
    {
      name: "lastname",
      type: "text",
      label: {
        en: "Name",
        fr: "Nom",
      },
      required: true,
    },
    {
      name: "first_name",
      type: "text",
      label: {
        en: "First Name",
        fr: "Prénom",
      },
      required: true,
    },
    {
      name: "category",
      type: "select",
      label: {
        en: "Categories",
        fr: "Catégories",
      },
      options: [
        {
          label: {
            en: "International",
            fr: "International",
          },
          value: "international",
        },
        {
          label: {
            en: "Fiscal",
            fr: "Fiscal",
          },
          value: "fiscal",
        },
      ],
      required: true,
    },
    {
      name: "type",
      type: "text",
      label: {
        en: "Type",
        fr: "Spécificité",
      },
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: {
        en: "Email",
        fr: "Email",
      },
      required: false,
    },
    {
      name: "phone",
      type: "text",
      label: {
        en: "Phone",
        fr: "Téléphone",
      },
      required: false,
    },
  ],
};
