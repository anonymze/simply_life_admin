import type { GlobalConfig } from "payload";

import { extractData } from "@/utils/xlsx";
import { canAccessApi, validateMedia } from "../utils/helper";

export const CommissionImports: GlobalConfig = {
  slug: "commission-imports",
  access: {
    read: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
  },
  admin: {
    group: {
      en: "Commissions",
      fr: "Commissions",
    },
  },
  labels: {
    singular: {
      en: "Commission Import",
      fr: "Import de commission",
    },
    plural: {
      en: "Commission Imports",
      fr: "Importation des commissions",
    },
  },
  endpoints: [
    {
      path: "/:userId",
      method: "get",
      handler: async (req) => {
        try {
          const { userId } = req.routeParams as { userId: string };

          if (!userId) throw new Error();

          // Get the global document
          const commissionImports = await req.payload.findGlobal({
            slug: "commission-imports",
          });

          if (!commissionImports?.files?.length) throw new Error();

          const userCommissions = await req.payload.find({
            collection: "app-users-commissions-code",
            where: {
              app_user: {
                equals: userId,
              },
            },
            select: {
              code: true,
            },
          });

          if (!userCommissions.docs.length)
            throw new Error(
              "Vous n'avez pas défini de codes de commission liés à cet utilisateur.",
            );

          const codes = userCommissions.docs
            .flatMap((doc) => doc.code)
            .map((codeObj) => codeObj.code);

          let totalGlobalEncours = 0,
            totalGlobalProduction = 0,
            totalGlobalStructured = 0;

          const suppliersData: {
            [key: string]: {
              encours: number;
              production: number;
              structured: number;
            };
          } = {};

          await Promise.all(
            commissionImports.files.map(async (supplierFile) => {
              if (
                typeof supplierFile.file === "string" ||
                typeof supplierFile.supplier === "string"
              )
                return;

              const supplierColumns = await req.payload.find({
                collection: "suppliers-commissions-column",
                where: {
                  supplier: {
                    equals: supplierFile.supplier.id,
                  },
                },
                select: {
                  type_column_letter: true,
                  code_column_letter: true,
                  amount_column_letter: true,
                },
              });

              if (!supplierColumns.docs.length)
                throw new Error(
                  `Vous n'avez pas défini de colonnes de commission pour le fournisseur ${supplierFile.supplier.name}.`,
                );

              const {
                type_column_letter,
                code_column_letter,
                amount_column_letter,
              } = supplierColumns.docs[0];

              const data = await extractData({
                file: supplierFile.file,
                columns: {
                  typeLetter: type_column_letter,
                  codeLetter: code_column_letter,
                  amountLetter: amount_column_letter,
                },
                codes,
              });

              totalGlobalEncours += data.totalEncours;
              totalGlobalProduction += data.totalProduction;
              totalGlobalStructured += data.totalStructured;
              suppliersData[supplierFile.supplier.id] = {
                encours: data.totalEncours,
                production: data.totalProduction,
                structured: data.totalStructured,
              };
            }),
          );

          return Response.json({
            totalGlobalEncours,
            totalGlobalProduction,
            totalGlobalStructured,
            suppliersData,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Une erreur inconnue est survenue, contactez le développeur.",
            },
            {
              status: 400,
            },
          );
        }
      },
    },
  ],
  fields: [
    {
      name: "files",
      type: "array",
      label: {
        en: "Commission Files",
        fr: "Fichiers de commission",
      },
      admin: {
        description:
          "Un fichier par fournisseur. Quand un fichier est importé pour un fournisseur, il écrase le précédent fichier importé pour celui-ci.",
      },
      labels: {
        singular: {
          en: "file",
          fr: "fichier",
        },
        plural: {
          en: "files",
          fr: "fichiers",
        },
      },
      validate: (data) => {
        const suppliers = data?.map((file: any) => file.supplier);
        const uniqueSuppliers = [...new Set(suppliers)];
        if (uniqueSuppliers.length !== suppliers?.length)
          return "Vous avez mis plusieurs fois le même fournisseur.";
        return true;
      },
      fields: [
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          hasMany: false,
          label: {
            en: "Supplier",
            fr: "Fournisseur",
          },
          required: true,
        },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          // @ts-expect-error
          validate: (data) => {
            return validateMedia(data, "sheet");
          },
          label: {
            en: "Commission file",
            fr: "Fichier de commission",
          },
          admin: {
            description: "Le fichier doit être au format Excel ou CSV.",
          },
          required: true,
        },
      ],
    },
  ],
};
