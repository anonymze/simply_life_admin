import type { CollectionConfig } from "payload";

import { canAccessApi } from "../utils/helper";

export const CommissionSuppliers: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  slug: "commission-suppliers",
  admin: {
    group: {
      en: "Commissions",
      fr: "Commissions",
    },
    hidden: true,
  },
  fields: [
    {
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",

      required: true,
      hasMany: false,
    },
    {
      name: "encours",
      type: "number",
      admin: {
        step: 0.01,
      },
      label: {
        en: "Encours",
        fr: "Encours",
      },
      required: true,
    },
    {
      name: "production",
      type: "number",
      admin: {
        step: 0.01,
      },
      label: {
        en: "Production",
        fr: "Production",
      },
      required: true,
    },
    {
      name: "sheet_lines",
      type: "json",
      label: {
        en: "sheet",
        fr: "sheet",
      },
      required: true,
    },
  ],
};
