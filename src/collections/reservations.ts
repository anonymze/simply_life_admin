import { ValidationError, type CollectionConfig } from "payload";
import { canAccessApi } from "@/utils/helper";


const businessStartHours = new Date(new Date().setHours(8, 0, 0, 0));
const businessEndHours = new Date(new Date().setHours(20, 0, 0, 0));

export const Reservations: CollectionConfig = {
	access: {
		read: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		create: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		update: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
		delete: ({ req }) => canAccessApi(req, ["associate", "employee", "independent", "visitor"]),
	},
	slug: "reservations",
	labels: {
		singular: {
			en: "Reservation desk",
			fr: "Réservation bureau",
		},
		plural: {
			en: "Reservations desks",
			fr: "Réservations bureaux",
		},
	},
	hooks: {
		beforeChange: [
			async ({ data, req, operation }) => {
				if (operation !== "create" && operation !== "update") return;

				const start_time_reservation = new Date(data.start_time_reservation);
				const end_time_reservation = new Date(data.end_time_reservation);

				if (start_time_reservation >= end_time_reservation) {
					throw new ValidationError({
						errors: [
							{
								message: "L'heure de début de réservation doit être avant l'heure de fin de réservation",
								label: "L'heure de début de réservation doit être avant l'heure de fin de réservation",
								path: "start_time_reservation",
							},
						],
					});
				}

				const existingReservations = await req.payload.find({
					collection: "reservations",
					where: {
						and: [
							{
								day_reservation: {
									equals: data.day_reservation,
								},
							},
							{
								id: {
									// ignore the current reservation (patch update)
									not_equals: req.routeParams?.id,
								},
							},
						],
					},
				});

				if (existingReservations.docs.length === 0) return;

				const hasConflict = existingReservations.docs.find((reservation) => {
					const existingStart = new Date(reservation.start_time_reservation ?? "");
					const existingEnd = new Date(reservation.end_time_reservation ?? "");

					return (
						start_time_reservation === existingStart ||
						end_time_reservation === existingEnd ||
						(start_time_reservation >= existingStart && start_time_reservation < existingEnd) ||
						(end_time_reservation > existingStart && end_time_reservation <= existingEnd) ||
						(start_time_reservation <= existingStart && end_time_reservation >= existingEnd)
					);
				});

				if (hasConflict) {
					throw new ValidationError({
						errors: [
							{
								message: `Ce créneau horaire est déjà réservé. ${new Date(hasConflict.start_time_reservation ?? "").toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(hasConflict.end_time_reservation ?? "").toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
								label: `Ce créneau horaire est déjà réservé.`,
								path: "start_time_reservation",
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
			name: "invitations",
			type: "array",
			label: {
				en: "Invitations",
				fr: "Invitations",
			},
			required: false,
			fields: [
				{
					name: "email",
					type: "text",
					label: {
						en: "Email",
						fr: "Email",
					},
					required: true,
				},
			],
		},
		{
			name: "day_reservation",
			type: "date",
			admin: {
				date: {
					minDate: new Date(),
					displayFormat: "dd/MM/yyyy",
					pickerAppearance: "dayOnly",
				},
			},
			label: {
				en: "Day of reservation",
				fr: "Jour de réservation",
			},
			required: true,
		},
		{
			name: "start_time_reservation",
			type: "date",
			label: {
				en: "Start time of reservation",
				fr: "Heure de début de réservation",
			},
			admin: {
				condition: (data) => data.day_reservation,
				date: {
					displayFormat: "HH:mm",
					pickerAppearance: "timeOnly",
					timeFormat: "HH:mm",
					minTime: businessStartHours,
					maxTime: businessEndHours,
				},
			},
			required: true,
		},
		{
			name: "end_time_reservation",
			type: "date",
			admin: {
				condition: (data) => data.day_reservation,
				date: {
					displayFormat: "HH:mm",
					pickerAppearance: "timeOnly",
					timeFormat: "HH:mm",
					minTime: businessStartHours,
					maxTime: businessEndHours,
				},
			},
			label: {
				en: "End time of reservation",
				fr: "Heure de fin de réservation",
			},
			required: true,
		},
		// {
		// 	name: "dates",
		// 	type: "ui",
		// 	label: {
		// 		en: "Status",
		// 		fr: "Statut",
		// 	},
		// 	admin: {
		// 		condition: (data) => data.day_reservation,
		// 		components: {
		// 			Field: "/components/dates-filter.tsx",
		// 		},
		// 	},
		// }
	],
};
