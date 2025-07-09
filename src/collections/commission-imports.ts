import type { CollectionConfig } from "payload";

import { Supplier } from "@/payload-types";
import { extractData } from "@/utils/xlsx";
import { canAccessApi, validateMedia } from "../utils/helper";

export const CommissionImports: CollectionConfig = {
  slug: "commission-imports",
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
    create: ({ req }) => canAccessApi(req, []),
  },
  admin: {
    group: {
      en: "Commissions",
      fr: "Commissions",
    },
    hidden: true,
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
          const commissionImports = await req.payload.find({
            collection: "commission-imports",
          });

          if (!commissionImports?.docs?.length)
            throw new Error(
              "Vous n'avez importé aucun fichier global de commission.",
            );

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
              supplierName: string;
              encours: number;
              production: number;
              structured: number;
            };
          } = {};

          await Promise.all(
            commissionImports.docs.map(async (supplierFile) => {
              if (
                typeof supplierFile.supplier === "string" ||
                typeof supplierFile.file === "string"
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

              console.log(`Supplier ${supplierFile.supplier.name} data:`, {
                encours: data.totalEncours,
                production: data.totalProduction,
                structured: data.totalStructured,
              });

              totalGlobalEncours += data.totalEncours;
              totalGlobalProduction += data.totalProduction;
              totalGlobalStructured += data.totalStructured;
              suppliersData[supplierFile.supplier.id] = {
                supplierName: supplierFile.supplier.name,
                encours: Number(data.totalEncours.toFixed(2)),
                production: Number(data.totalProduction.toFixed(2)),
                structured: Number(data.totalStructured.toFixed(2)),
              };
            }),
          );

          return Response.json({
            totalGlobalEncours: totalGlobalEncours.toFixed(2),
            totalGlobalProduction: totalGlobalProduction.toFixed(2),
            totalGlobalStructured: totalGlobalStructured.toFixed(2),
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
    {
      path: "/custom-create",
      method: "post",
      handler: async (req) => {
        try {
          const formData = await req.formData?.();

          const file = formData?.get("file") as File;
          const supplierId = formData?.get("supplier") as Supplier["id"];

          if (!file || !supplierId) throw new Error();

          // Get the global document
          const supplier = await req.payload.findByID({
            collection: "suppliers",
            id: supplierId,
          });

          if (!supplier) throw new Error();

          const fileBuffer = Buffer.from(await file.arrayBuffer());

          // Check if commission import already exists for this supplier
          const existingImport = await req.payload.find({
            collection: "commission-imports",
            where: {
              supplier: {
                equals: supplierId,
              },
            },
          });

          const media = await req.payload.create({
            collection: "media",
            file: {
              data: fileBuffer,
              size: file.size,
              name: file.name,
              mimetype: file.type,
            },
            data: {
              alt: file.name,
            },
          });

          if (existingImport.docs.length > 0) {
            // Update existing commission import
            await req.payload.update({
              collection: "commission-imports",
              id: existingImport.docs[0].id,
              data: {
                file: media.id,
              },
            });
          } else {
            // Create new commission import
            await req.payload.create({
              collection: "commission-imports",
              data: {
                supplier: supplier.id,
                file: media.id,
              },
            });
          }
          return Response.json(
            { success: true },
            {
              status: 201,
            },
          );
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
      name: "supplier",
      type: "relationship",
      relationTo: "suppliers",
      hasMany: false,
      label: {
        en: "Supplier",
        fr: "Fournisseur",
      },
      required: true,
      unique: true,
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
};
