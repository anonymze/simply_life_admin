"use client";

import type { AppUser, Media } from "@/payload-types";
import { FieldLabel, TextInput, useTranslation, Upload, File } from "@payloadcms/ui";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function FieldsEdit({ initialData }: { initialData: AppUser }) {
	const { i18n } = useTranslation();
	const [photoData, setPhotoData] = useState<Media | null>(null);

	React.useEffect(() => {
		fetch;
	}, [initialData]);

	// Fetch the photo data if we have a photo ID
	React.useEffect(() => {
		if (initialData.photo && typeof initialData.photo === "string") {
			fetch(`/api/media/${initialData.photo}`)
				.then((res) => res.json())
				.then((data) => setPhotoData(data))
				.catch((err) => console.error("Error fetching photo:", err));
		}
	}, [initialData.photo]);

	return (
		<div className="render-fields document-fields__fields">
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelPhoto")} />

				{photoData && (
					<div>
						<img
							src={photoData.url || ""}
							style={{ objectFit: "cover", width: "130px", maxHeight: "200px" }}
						/>
					</div>
				)}
				{!initialData.photo && (
					<div>
						{/* @ts-ignore */}
						<p style={{ fontSize: "12px", color: "#666" }}>{i18n.t("app-users:noPhoto")}</p>
					</div>
				)}
			</div>
			<div className="field-type text">
				<FieldLabel label="Email" />
				<TextInput
					path="email"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
					value={initialData.email}
					readOnly
				/>
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelRole")} />
				<TextInput
					path="role"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
					// @ts-ignore
					value={i18n.t(`app-users:${initialData.role}`)}
					readOnly
				/>
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelLastname")} />
				<TextInput
					path="lastname"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
					value={initialData.lastname}
					readOnly
				/>
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelFirstname")} />
				<TextInput
					path="firstname"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
					value={initialData.firstname}
					readOnly
				/>
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelPhone")} />
				<TextInput
					path="phone"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
					value={initialData.phone ?? ""}
					readOnly
				/>
			</div>
		
		</div>
	);
}
