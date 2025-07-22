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
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",
      unique: false,
      required: true,
    },
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
      name: "coupon",
      type: "number",
      label: {
        en: "Coupn",
        fr: "Coupon annuel",
      },
      required: true,
    },
    {
      name: "barrier",
      type: "number",
      label: {
        en: "Barrier",
        fr: "Barrière dégressivité",
      },
      required: true,
    },
    {
      name: "constatation",
      type: "date",
      label: {
        en: "Constatation",
        fr: "Date de constatation",
      },
      required: true,
    },
    {
      name: "insurer",
      type: "text",
      label: {
        en: "Insurer",
        fr: "Assureur",
      },
      required: true,
    },
  ],
};
