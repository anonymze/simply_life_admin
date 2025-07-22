import { canAccessApi } from "@/utils/helper";
import { ValidationError, type CollectionConfig } from "payload";

export const AgencyLife: CollectionConfig = {
  access: {
    read: ({ req }) =>
      canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
    create: ({ req }) => canAccessApi(req, []),
    update: ({ req }) => canAccessApi(req, []),
    delete: ({ req }) => canAccessApi(req, []),
  },
  labels: {
    singular: {
      en: "Agency life event",
      fr: "Évènement Groupe Valorem",
    },
    plural: {
      en: "Agency life events",
      fr: "Évènements Groupe Valorem",
    },
  },
  admin: {
    useAsTitle: "title",
  },
  slug: "agency-life",

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== "create" && operation !== "update") return;

        const start_event = new Date(data.event_start);
        const end_event = new Date(data.event_end);

        if (start_event >= end_event) {
          throw new ValidationError({
            errors: [
              {
                message:
                  "Le début de l'évènement doit être avant la fin de l'évènement",
                label:
                  "Le début de l'évènement doit être avant la fin de l'évènement",
                path: "event_start",
              },
            ],
          });
        }

        return;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: {
        en: "Title",
        fr: "Titre",
      },
      required: true,
    },
    {
      name: "annotation",
      type: "text",
      label: {
        en: "Annotation",
        fr: "Annotation",
      },
      required: false,
    },
    {
      name: "type",
      type: "select",
      required: true,
      label: {
        en: "Events type",
        fr: "Type d'évènements",
      },
      options: [
        {
          label: {
            en: "General",
            fr: "Général",
          },
          value: "general",
        },
        {
          label: {
            en: "Sport",
            fr: "Sportif",
          },
          value: "sport",
        },
        {
          label: {
            en: "Seminar",
            fr: "Séminaire",
          },
          value: "seminaire",
        },
        {
          label: {
            en: "Food",
            fr: "Repas",
          },
          value: "food",
        },
        {
          label: {
            en: "Birthday ",
            fr: "Anniversaire",
          },
          value: "birthday",
        },
        {
          label: {
            en: "Meeting ",
            fr: "Réunion",
          },
          value: "meeting",
        },
      ],
      defaultValue: "general",
    },
    {
      name: "event_start",
      type: "date",
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
          pickerAppearance: "dayAndTime",
          timeFormat: "HH:mm",
        },
      },
      label: {
        en: "Event start",
        fr: "Date de début de l'évènement",
      },
      required: true,
    },
    {
      name: "event_end",
      type: "date",
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
          pickerAppearance: "dayAndTime",
          timeFormat: "HH:mm",
        },
      },
      label: {
        en: "Event end",
        fr: "Date de fin de l'évènement",
      },
      required: true,
    },
    {
      name: "address",
      type: "text",
      label: {
        en: "Address of the event",
        fr: "Adresse de l'évènement",
      },
      required: false,
    },
  ],
};
