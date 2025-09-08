import { sendEmail } from "@/emails/email";
import { enum_app_users_role } from "@/payload-generated-schema";
import {
  canAccessApi,
  generateImageBlurHash,
  rolesOptions,
  validateMedia,
  validatePassword,
} from "@/utils/helper";
import { readFileSync } from "fs";
import { join } from "path";
import { type CollectionConfig } from "payload";
import { z } from "zod";

export const initialRegistrationSchema = z.object({
  email: z.string().email(),
  role: z.enum(enum_app_users_role.enumValues),
  apple_store_code: z.string().optional(),
});


const finalRegistrationSchema = z.object({
  id: z.string(),
  email: z.string().email({ message: "Entrez une adresse mail valide" }),
  role: z.enum(enum_app_users_role.enumValues),
  password: z
    .string()
    .min(10, {
      message: "Le mot de passe doit comporter au moins 10 caractères",
    })
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: "Le mot de passe doit contenir au moins une lettre",
    })
    .refine((password) => /\d/.test(password), {
      message: "Le mot de passe doit contenir au moins un chiffre",
    }),
  lastname: z.string().min(1, { message: "Le nom est requis" }),
  firstname: z.string().min(1, { message: "Le prénom est requis" }),
  cabinet: z.string().optional(),
  birthday: z.string().optional(),
  entry_date: z.string().optional(),
  phone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit comporter au moins 10 caractères",
    })
    .optional()
    .or(z.literal("")),
  file: z.any().optional(),
});

export const AppUsers: CollectionConfig = {
  slug: "app-users",
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  auth: {
    maxLoginAttempts: 4,
    tokenExpiration: 60 * 60 * 24 * 60, // 60 days
    // tokenExpiration: 3 * 60, // 3 min
  },
  admin: {
    group: {
      en: "Users",
      fr: "Utilisateurs",
    },
    defaultColumns: ["photo", "email", "role", "lastname", "firstname"],
    useAsTitle: "email",
    components: {
      views: {
        edit: {
          default: {
            Component: "/components/app-users/create-view.tsx",
          },
        },
      },
    },
  },
  labels: {
    singular: {
      en: "User / Organisation chart",
      fr: "Utilisateur  / Organigramme",
    },
    plural: {
      en: "Users / Organisation chart",
      fr: "Utilisateurs / Organigramme",
    },
  },

  hooks: {
    beforeValidate: [validatePassword],
    afterLogin: [
      async (payloadRequest) => {
        const { expoPushToken } = await payloadRequest.req?.json?.();
        if (!expoPushToken) return;

        await payloadRequest.req?.payload?.update({
          collection: "app-users",
          id: payloadRequest.user?.id,
          data: {
            notifications_token: expoPushToken,
          },
        });
      },
    ],
  },
  endpoints: [
    {
      path: "/init-registration",
      method: "post",
      handler: async (req) => {
        try {
          const data = await req.json?.();
          const validatedData = initialRegistrationSchema.parse(data);

          await createTemporaryUserAndSendEmail(req, {
            email: validatedData.email,
            role: validatedData.role,
            apple_store_code: validatedData.apple_store_code
          });

          return Response.json({
            message: "OK",
          });
        } catch (error) {
          console.log(error);
          return Response.json(
            {
              message: "KO",
            },
            {
              status: 500,
            },
          );
        }
      },
    },
    {
      path: "/finish-registration",
      method: "post",
      handler: async (req) => {
        try {
          const formData = await req.formData?.();

          if (!formData) throw new Error();

          const validatedData = finalRegistrationSchema.parse(
            Object.fromEntries(formData),
          );

          // check id is from temporary-app-users
          const temporaryUser = await req.payload.find({
            collection: "temporary-app-users",
            where: {
              email: {
                equals: validatedData.email,
              },
            },
          });

          if (temporaryUser.docs.length === 0) throw new Error();

          let image = null;

          // check if there is a file and if it is an image
          if (validatedData.file) {
            if (!validatedData.file.type.startsWith("image/"))
              throw new Error();
            const fileBuffer = Buffer.from(
              await validatedData.file.arrayBuffer(),
            );
            // // create image
            image = await req.payload.create({
              collection: "media",
              file: {
                data: fileBuffer,
                size: validatedData.file.size,
                name: validatedData.file.name,
                mimetype: validatedData.file.type,
              },
              data: {
                alt: validatedData.file.name,
                blurhash: await generateImageBlurHash(fileBuffer),
              },
            });
          }

          // create real user
          await req.payload.create({
            collection: "app-users",
            data: {
              email: validatedData.email,
              password: validatedData.password,
              role: validatedData.role,
              lastname: validatedData.lastname,
              firstname: validatedData.firstname,
              phone: validatedData.phone,
              cabinet: validatedData.cabinet,
              birthday: validatedData.birthday || undefined,
              entry_date: validatedData.entry_date || undefined,
              photo: image?.id,
            },
          });

          // delete temporary user
          await req.payload.delete({
            collection: "temporary-app-users",
            id: temporaryUser.docs[0].id,
          });

          return Response.json({
            message: "OK",
          });
        } catch (error) {
          console.log(error);
          return Response.json(
            {
              message: "KO",
            },
            {
              status: 500,
            },
          );
        }
      },
    },
    {
      path: "/bulk-upload",
      method: "post",
      handler: async (req) => {
        try {
          const formData = await req.formData?.();
          const file = formData?.get('file') as File;

          if (!file) {
            return Response.json(
              { error: 'Aucun fichier fourni' },
              { status: 400 }
            );
          }

          // Vérifier le type de fichier
          const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ];

          if (!allowedTypes.includes(file.type)) {
            return Response.json(
              { error: 'Type de fichier non supporté. Utilisez CSV ou Excel.' },
              { status: 400 }
            );
          }

          // Convertir le fichier en buffer et parser
          const XLSX = await import('xlsx');
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (data.length < 2) {
            return Response.json(
              { error: 'Le fichier doit contenir au moins 2 lignes (en-têtes + données)' },
              { status: 400 }
            );
          }

          // Ignorer la première ligne et traiter les données
          const rows = data.slice(1);
          const validUsers = [];
          const errors = [];

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const email = row[0]?.toString().trim() || '';
            const role = row[1]?.toString().trim() || '';
            const apple_store_code = row[2]?.toString().trim() || '';

            // Ignorer les lignes vides
            if (!email && !role) continue;

            // Validation
            if (!email || !role) {
              errors.push(`Ligne ${i + 2}: email et rôle sont requis`);
              continue;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              errors.push(`Ligne ${i + 2}: format email invalide`);
              continue;
            }

            const validRoles = ['associate', 'employee', 'independent', 'visitor'];
            if (!validRoles.includes(role.toLowerCase())) {
              errors.push(`Ligne ${i + 2}: rôle invalide. Rôles valides: ${validRoles.join(', ')}`);
              continue;
            }

            validUsers.push({
              email,
              role: role.toLowerCase(),
              apple_store_code: apple_store_code || undefined
            });
          }

          if (errors.length > 0) {
            return Response.json(
              { error: `Erreurs détectées:\n${errors.join('\n')}` },
              { status: 400 }
            );
          }

          // Créer les utilisateurs temporaires via Payload
          const createdUsers = [];
          for (const userData of validUsers) {
            try {
              const tempUser = await createTemporaryUserAndSendEmail(req, userData);
              createdUsers.push(tempUser);
            } catch (error: any) {
              errors.push(`${userData.email}: ${error.message}`);
            }
          }

          if (errors.length > 0) {
            return Response.json({
              success: true,
              message: `${createdUsers.length} utilisateurs créés avec succès`,
              errors: errors,
              partialSuccess: true
            });
          }

          return Response.json({
            success: true,
            message: `${createdUsers.length} utilisateurs temporaires créés et emails envoyés avec succès`
          });

        } catch (error: any) {
          console.error('Erreur bulk upload:', error);
          return Response.json(
            { error: error.message || 'Erreur lors du traitement du fichier' },
            { status: 500 }
          );
        }
      },
    },
  ],
  fields: [
    {
      name: "lastname",
      type: "text",
      required: true,
      label: {
        en: "Lastname",
        fr: "Nom",
      },
    },
    {
      name: "firstname",
      type: "text",
      required: true,
      label: {
        en: "Firstname",
        fr: "Prénom",
      },
    },
    {
      name: "cabinet",
      type: "text",
      required: false,
      label: {
        en: "Cabinet name",
        fr: "Nom du cabinet",
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: {
        en: "Email",
        fr: "Email",
      },
    },
    {
      name: "phone",
      type: "text",
      required: false,
      label: {
        en: "Phone",
        fr: "Téléphone",
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Le fichier doit être une image.",
      },
      // @ts-expect-error
      validate: (data) => {
        return validateMedia(data);
      },
      required: false,
      label: {
        en: "Photo",
        fr: "Photo",
      },
    },
    {
      name: "notifications_token",
      type: "text",
      required: false,
      label: {
        en: "Notifications token",
        fr: "Token de notifications",
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "entry_date",
      type: "date",
      required: false,
      label: {
        en: "Entry date",
        fr: "Date d'entrée",
      },
    },
    {
      name: "birthday",
      type: "date",
      required: false,
      label: {
        en: "Birthday",
        fr: "Date de naissance",
      },
    },
    {
      name: "role",
      type: "select",
      required: true,
      saveToJWT: true,
      label: {
        en: "Role",
        fr: "Rôle",
      },
      options: rolesOptions,
      defaultValue: "independent",
    },
    {
      name: "description-below-password",
      type: "ui",
      admin: {
        components: {
          Field: "/components/description-below-password.tsx",
        },
      },
    },
  ],
};

// Fonction réutilisable pour créer un utilisateur temporaire et envoyer l'email
async function createTemporaryUserAndSendEmail(
  req: any,
  userData: { email: string; role: string; apple_store_code?: string }
) {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await req.payload.find({
    collection: "app-users",
    where: { email: { equals: userData.email } }
  });

  if (existingUser.docs.length > 0) {
    throw new Error(`L'utilisateur ${userData.email} existe déjà`);
  }

  // Supprimer l'utilisateur temporaire existant s'il existe
  const existingTemp = await req.payload.find({
    collection: "temporary-app-users",
    where: { email: { equals: userData.email } }
  });

  if (existingTemp.docs.length > 0) {
    await req.payload.delete({
      collection: "temporary-app-users",
      id: existingTemp.docs[0].id
    });
  }

  // Créer l'utilisateur temporaire
  const tempUser = await req.payload.create({
    collection: "temporary-app-users",
    data: userData
  });

  // Préparer l'email
  const language = req.i18n.language === "fr" ? "fr" : "en";
  const link = `/app-users/create/${tempUser.id}`;
  const fullLink = req.payload.config.serverURL + link;

  // Envoyer l'email selon le type
  if (userData.apple_store_code) {
    await sendEmail({
      to: userData.email,
      subject: "Création de compte Simply Life",
      attachments: [
        {
          filename: "installation_app_mobile.pdf",
          path: join(process.cwd(), "src/assets/pdfs/installation_app_mobile.pdf"),
          contentType: "application/pdf",
        },
      ],
      text: readFileSync(
        join(process.cwd(), `src/emails/templates/${language}/subscription-app-user-apple.txt`),
        "utf-8"
      )
        .replace("{{registrationLink}}", fullLink)
        .replace("{{appStoreCode}}", userData.apple_store_code || ""),
      html: readFileSync(
        join(process.cwd(), `src/emails/templates/${language}/subscription-app-user-apple.html`),
        "utf-8"
      )
        .replace("{{registrationLink}}", fullLink)
        .replace("{{appStoreCode}}", userData.apple_store_code || ""),
    });
  } else {
    await sendEmail({
      to: userData.email,
      subject: "Création de compte Simply Life",
      text: readFileSync(
        join(process.cwd(), `src/emails/templates/${language}/subscription-app-user.txt`),
        "utf-8"
      ).replace("{{registrationLink}}", fullLink),
      html: readFileSync(
        join(process.cwd(), `src/emails/templates/${language}/subscription-app-user.html`),
        "utf-8"
      ).replace("{{registrationLink}}", fullLink),
    });
  }

  return tempUser;
}
