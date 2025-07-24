import { canAccessApi, validateMedia } from "@/utils/helper";
import { type CollectionConfig } from "payload";

export const Fundesys: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  slug: "fundesys",
  admin: {
    group: {
      en: "Newsletters",
      fr: "Newsletters",
    },
  },
  fields: [
    {
      name: "date",
      type: "date",
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy",
        },
      },
      label: {
        en: "Date of release",
        fr: "Date de sortie",
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
        en: "File",
        fr: "Fichier",
      },
      admin: {
        description: "Le fichier doit être au format PDF.",
      },
      required: true,
    },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Video",
        fr: "Vidéo",
      },
      // @ts-expect-error
      validate: (data) => {
        return validateMedia(data, "video/");
      },
      admin: {
        description: "Le fichier doit être une vidéo.",
      },
      required: true,
    },
    {
      name: "excel",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Excel",
        fr: "Excel",
      },
      // @ts-expect-error
      validate: (data) => {
        return validateMedia(data, "sheet");
      },
      admin: {
        description: "Le fichier doit être au format Excel ou CSV.",
      },
      required: true,
    },
  ],
};
