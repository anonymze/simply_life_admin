import { supplier_products_rels } from "@/payload-generated-schema";
import { canAccessApi, validateMedia } from "@/utils/helper";
import { eq } from "@payloadcms/db-vercel-postgres/drizzle";
import { type CollectionConfig } from "payload";
import { z } from "zod";

export const Suppliers: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  labels: {
    singular: {
      en: "Supplier",
      fr: "Fournisseur",
    },
    plural: {
      en: "Suppliers",
      fr: "Fournisseurs",
    },
  },
  admin: {
    group: {
      en: "Suppliers",
      fr: "Fournisseurs",
    },
    // defaultColumns: ["name", "range", "price", "priceType", "threshold"],
    useAsTitle: "name",
  },
  slug: "suppliers",
  endpoints: [
    {
      method: "get",
      path: "/selection",
      handler: async (req) => {
        // const query = optionalQuerySchema.parse(req.query);

        const results = await req.payload.find({
          collection: "suppliers",
          where: {
            "selection.selection": {
              equals: true,
            },
          },
          // sort: query.sort,
          limit: 10,
        });

        return Response.json(results);
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create" && operation !== "update") return doc;

        const supplierId = doc.id;
        const supplierProductId = req.data?.supplier_product_id;
        const payload = req.payload;

        if (!supplierId) return;

        // Create new relation
        try {
          if (supplierProductId) {
            await payload.db.drizzle
              .delete(supplier_products_rels)
              .where(eq(supplier_products_rels.suppliersID, supplierId));

            await payload.db.drizzle.insert(supplier_products_rels).values({
              parent: supplierProductId,
              suppliersID: supplierId,
              path: "suppliers",
            });
          }
        } catch (error) {}

        return doc;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: {
        en: "Name",
        fr: "Nom",
      },
      required: true,
    },
    {
      name: "product",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "src/components/supplier-product.tsx",
        },
      },
    },
    {
      name: "website",
      type: "text",
      label: {
        en: "Website",
        fr: "Site internet",
      },
      required: false,
    },
    {
      name: "logo_mini",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Le fichier doit être une image.",
      },
      // @ts-expect-error
      validate: (data) => {
        return validateMedia(data);
      },
      label: {
        en: "Mini logo",
        fr: "Mini logo",
      },
      required: false,
    },
    {
      name: "logo_full",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Le fichier doit être une image.",
      },
      // @ts-expect-error
      validate: (data) => {
        return validateMedia(data);
      },
      label: {
        en: "Full logo",
        fr: "Logo entier",
      },
      required: false,
    },
    {
      name: "contact_info",
      type: "group",
      label: {
        en: "Contact Information",
        fr: "Informations de contact",
      },
      fields: [
        {
          name: "lastname",
          type: "text",
          label: {
            en: "Contact Lastname",
            fr: "Nom du contact",
          },
          required: false,
        },
        {
          name: "firstname",
          type: "text",
          label: {
            en: "Contact Firstname",
            fr: "Prénom du contact",
          },
          required: false,
        },
        {
          name: "email",
          type: "email",
          label: {
            en: "Contact Email",
            fr: "Email du contact",
          },
          required: false,
        },
        {
          name: "phone",
          type: "text",
          label: {
            en: "Contact Phone",
            fr: "Téléphone du contact",
          },
          admin: {
            description: "Séparez les numéros par une virgule si plusieurs.",
          },
          required: false,
        },
      ],
    },
    {
      name: "enveloppe",
      type: "group",
      label: {
        en: "Enveloppe",
        fr: "Enveloppe CIF",
      },
      fields: [
        {
          name: "amount",
          type: "number",
          label: {
            en: "Contact Lastname",
            fr: "Montant enveloppe",
          },
          required: false,
        },
        {
          name: "reduction",
          type: "number",
          label: {
            en: "Contact Firstname",
            fr: "Réduction d'impôt",
          },
          required: false,
        },
        {
          name: "echeance",
          type: "date",
          label: {
            en: "Echéance de l'enveloppe",
            fr: "Echéance de l'enveloppe",
          },
          admin: {
            date: {
              displayFormat: "dd/MM/yyyy",
            },
          },
          required: false,
        },
        {
          name: "actualisation",
          type: "date",
          label: {
            en: "Date d'actualisatio",
            fr: "Date d'actualisation",
          },
          admin: {
            date: {
              displayFormat: "dd/MM/yyyy",
            },
          },
          required: false,
        },
      ],
    },
    {
      name: "selection",
      type: "group",
      label: {
        en: "Selection",
        fr: "Notre sélection",
      },
      fields: [
        {
          name: "selection",
          type: "checkbox",
          label: {
            en: "Mettre en sélection du moment",
            fr: "Mettre en sélection du moment",
          },
          required: false,
        },
        {
          name: "category",
          type: "text",
          label: {
            en: "Category",
            fr: "Catégorie",
          },
          required: false,
        },
        {
          name: "brochure",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Le fichier doit être au format PDF.",
          },
          // @ts-expect-error
          validate: (data) => {
            return validateMedia(data, "application/pdf");
          },
          label: {
            en: "Brochure",
            fr: "Brochure",
          },
          required: false,
        },
      ],
    },
    {
      name: "connexion",
      type: "group",
      label: {
        en: "Connexion",
        fr: "Connexion",
      },
      fields: [
        {
          name: "email",
          type: "text",
          label: {
            en: "Identifier",
            fr: "Identifiant",
          },
          required: false,
        },
        {
          name: "password",
          type: "text",
          label: {
            en: "Password",
            fr: "Mot de passe",
          },
          required: false,
        },
      ],
    },
    {
      name: "other_information",
      type: "array",
      label: {
        en: "Other Information",
        fr: "Ajouter des produits",
      },
      labels: {
        singular: "Ajouter un produit",
        plural: "Ajouter un produit",
      },
      fields: [
        {
          name: "scpi",
          type: "text",
          label: {
            en: "SCPI",
            fr: "SCPI",
          },
          required: false,
        },
        {
          name: "theme",
          type: "text",
          label: {
            en: "Theme(s)",
            fr: "Thématique(s)",
          },
          required: false,
        },
        {
          name: "brochure",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Le fichier doit être au format PDF.",
          },
          // @ts-expect-error
          validate: (data) => {
            return validateMedia(data, "application/pdf");
          },
          label: {
            en: "Brochure",
            fr: "Brochure",
          },
          required: false,
        },
        {
          name: "annotation",
          type: "text",
          label: {
            en: "Annotation",
            fr: "Remarque",
          },
          required: false,
        },
        {
          name: "epargne",
          type: "checkbox",
          label: {
            en: "Epargne",
            fr: "Epargne",
          },
          required: false,
        },
        {
          name: "minimum_versement",
          type: "text",
          label: {
            en: "Minimum versement",
            fr: "Minimum de versement",
          },
          required: false,
        },
        {
          name: "subscription_fee",
          type: "text",
          label: {
            en: "Subscription Fee",
            fr: "Frais de souscription",
          },
          required: false,
        },
        {
          name: "duration",
          type: "text",
          label: {
            en: "Duration",
            fr: "Délai de jouissance",
          },
          required: false,
        },
        {
          name: "rentability_n1",
          type: "text",
          label: {
            en: "Rentability N1",
            fr: "Rentabilité N1",
          },
          required: false,
        },
        {
          name: "commission_offer_group_valorem",
          type: "text",
          label: {
            en: "Commission offer Groupe Valorem",
            fr: "Commission pour l'offre Groupe Valorem",
          },
          required: false,
        },
        {
          name: "commission_public_offer",
          type: "text",
          label: {
            en: "Commision public offer",
            fr: "Commission pour l'offre publique",
          },
          required: false,
        },
      ],
    },
  ],
};

const optionalQuerySchema = z.object({
  where: z
    .object({
      "selection.selection": z
        .object({
          equals: z.boolean(),
        })
        .optional(),
    })
    .optional(),
  sort: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "10")),
});
