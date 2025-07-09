import { canAccessApi } from "@/utils/helper";
import type { CollectionConfig } from "payload";

export const SupplierCommissionsColumn: CollectionConfig = {
  slug: "suppliers-commissions-column",
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
    useAsTitle: "supplier",
    hidden: true,
  },
  labels: {
    singular: {
      en: "Supplier / Code column",
      fr: "Association fournisseur / colonne de commission",
    },
    plural: {
      en: "Supplier / Code column",
      fr: "Association fournisseur / colonne de commission",
    },
  },
  fields: [
    {
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",
      label: {
        en: "Supplier",
        fr: "Fournisseur",
      },
      required: true,
      unique: true,
      hasMany: false,
    },
    {
      name: "code_column_letter",
      type: "text",
      maxLength: 1,
      label: {
        en: "Column code",
        fr: "Lettre de la colonne du code unique",
      },
      required: true,
    },
    {
      name: "type_column_letter",
      type: "text",
      maxLength: 1,
      label: {
        en: "Column type",
        fr: "Lettre de la colonne du type de commission",
      },
      required: true,
    },
    {
      name: "amount_column_letter",
      type: "text",
      maxLength: 1,
      label: {
        en: "Column amount",
        fr: "Lettre de la colonne du montant de la commission",
      },
      required: true,
    },
    {
      name: "header_row",
      type: "number",
      label: {
        en: "Column amount",
        fr: "Lettre de la colonne du montant de la commission",
      },
      required: true,
    },
  ],
};
