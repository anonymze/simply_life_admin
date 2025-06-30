import { canAccessApi } from "@/utils/helper";
import { type CollectionConfig } from "payload";

export const Structured: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  labels: {
    singular: {
      en: "Structured Product",
      fr: "Produit structuré",
    },
    plural: {
      en: "Structured Products",
      fr: "Produits structurés",
    },
  },
  slug: "structured",
  fields: [
    {
      name: "max",
      type: "number",
      label: {
        en: "Max",
        fr: "Maximum de l'enveloppe",
      },
      required: true,
    },
    {
      name: "current",
      type: "number",
      label: {
        en: "Current",
        fr: "Montant actuel",
      },
      required: true,
    },
    {
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",
      required: true,
    },
  ],
};
