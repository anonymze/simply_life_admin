import { canAccessApi, validateMedia } from "@/utils/helper";
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
      label: {
        en: "Supplier",
        fr: "Assureur",
      },
      unique: false,
      required: true,
    },
    {
      name: "broker",
      type: "select",
      label: {
        en: "Broker",
        fr: "Broker",
      },
      options: [
        {
          label: {
            en: "Kepler Cheuvreux",
            fr: "Kepler Cheuvreux",
          },
          value: "kepler",
        },
        {
          label: {
            en: "Irbis",
            fr: "Irbis",
          },
          value: "irbis",
        },
        {
          label: {
            en: "Silex",
            fr: "Silex",
          },
          value: "silex",
        },
      ],
      required: true,
    },
    {
      name: "max",
      type: "number",
      label: {
        en: "Max",
        fr: "Enveloppe globale",
      },
      required: true,
    },
    {
      name: "current",
      type: "number",
      label: {
        en: "Current",
        fr: "Solde enveloppe",
      },
      required: true,
    },
    {
      name: "start_comm",
      type: "date",
      label: {
        en: "start comm",
        fr: "Début de commercialisation",
      },
      required: true,
    },
    {
      name: "end_comm",
      type: "date",
      label: {
        en: "end comm",
        fr: "Fin de commercialisation",
      },
      required: true,
    },
    {
      name: "constatation",
      type: "date",
      label: {
        en: "date constations",
        fr: "Date de constatation",
      },
      required: true,
    },
    {
      name: "sousjacent",
      type: "text",
      label: {
        en: "Sous-jacent",
        fr: "Sous-jacent",
      },
      required: true,
    },
    {
      name: "mature",
      type: "text",
      label: {
        en: "Maturité",
        fr: "Maturité",
      },
      required: true,
    },
    {
      name: "coupon",
      type: "text",
      label: {
        en: "Coupon de remboursement anticipé",
        fr: "Coupon de remboursement anticipé",
      },
      required: true,
    },
    {
      name: "frequency",
      type: "text",
      label: {
        en: "Fréquence de remboursement anticipé",
        fr: "Fréquence de remboursement anticipé",
      },
      required: true,
    },
    {
      name: "refund",
      type: "text",
      label: {
        en: "Seuil de remboursement anticipé",
        fr: "Seuil de remboursement anticipé :",
      },
      required: true,
    },
    {
      name: "capital",
      type: "text",
      label: {
        en: "Seuil de perte en capital à maturité",
        fr: "Seuil de perte en capital à maturité",
      },
      required: true,
    },
    {
      name: "offers",
      type: "array",
      label: {
        en: "Offers / Promotions / Brochures",
        fr: "Offres / Promotions / Brochures",
      },
      labels: {
        singular: {
          en: "Offer / Promotion / Brochure",
          fr: "Offre / Promotion / Brochure",
        },
        plural: {
          en: "Offers / Promotions / Brochures",
          fr: "Offres / Promotions / Brochures",
        },
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: {
            en: "Brochure name",
            fr: "Nom de la brochure",
          },
          required: true,
        },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          // @ts-expect-error
          validate: (data) => {
            return validateMedia(data, "application/pdf");
          },
          label: {
            en: "Brochure File",
            fr: "Fichier de la brochure",
          },
          admin: {
            description: "Le fichier doit être au format PDF.",
          },
          required: true,
        },
        {
          name: "description",
          type: "text",
          label: {
            en: "Offer Description",
            fr: "Description de l'offre",
          },
          required: false,
        },
      ],
    },
  ],
};

// ODDO BHF     Suravenir    Cardif BNP Paribas    Oradea Vie    Generali Patrimoine     Swiss Life     AXA Thema
