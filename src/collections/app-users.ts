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
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
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

          // Check if user already exists
          const existingUser = await req.payload.find({
            collection: "app-users",
            where: {
              email: {
                equals: validatedData.email,
              },
            },
          });

          if (existingUser.docs.length > 0) {
            return Response.json(
              {
                message: "KO",
              },
              {
                status: 400,
              },
            );
          }

          const existingTemporaryUser = await req.payload.find({
            collection: "temporary-app-users",
            where: {
              email: {
                equals: validatedData.email,
              },
            },
          });

          if (existingTemporaryUser.docs.length > 0) {
            await req.payload.delete({
              collection: "temporary-app-users",
              id: existingTemporaryUser.docs[0].id,
            });
          }

          // Create a new temporary user with just email and role
          const userTemporary = await req.payload.create({
            collection: "temporary-app-users",
            data: {
              email: validatedData.email,
              role: validatedData.role,
            },
          });

          const language = req.i18n.language === "fr" ? "fr" : "en";
          const link = `/app-users/create/${userTemporary.id}`;
          const fullLink = req.payload.config.serverURL + link;

          console.log("Registration email debug:", {
            to: validatedData.email,
            language,
            link,
            fullLink,
            serverURL: req.payload.config.serverURL,
            subject: "Création de compte Simply Life",
          });

          await sendEmail({
            to: validatedData.email,
            subject: "Création de compte Simply Life",
            text: readFileSync(
              join(
                process.cwd(),
                `src/emails/templates/${language}/subscription-app-user.txt`,
              ),
              "utf-8",
            ).replace("{{registrationLink}}", fullLink),

            html: readFileSync(
              join(
                process.cwd(),
                `src/emails/templates/${language}/subscription-app-user.html`,
              ),
              "utf-8",
            ).replace("{{registrationLink}}", fullLink),
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
              lastname: validatedData.lastName,
              firstname: validatedData.firstName,
              phone: validatedData.phone,
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
