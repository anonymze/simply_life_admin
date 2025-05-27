"use client";

import type { AppUser, Media } from "@/payload-types";
import { FieldLabel, TextInput, useTranslation } from "@payloadcms/ui";
import React, { useState } from "react";

export default function FieldsEdit({ initialData }: { initialData: AppUser }) {
	const { i18n } = useTranslation();
	const [photoData, setPhotoData] = useState<Media | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { id: userId } = initialData;

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
				<div className="field-type upload">
					<div className="upload__wrap">
						<div className="upload__image-container">
							{isUploading ? (
								<div
									style={{
										width: 120,
										height: 120,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										background: "#f5f5f5",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											width: "24px",
											height: "24px",
											border: "3px solid #e0e0e0",
											borderTop: "3px solid #000",
											borderRadius: "50%",
											animation: "spin 1s linear infinite",
										}}
									/>
									<style>
										{`
											@keyframes spin {
												0% { transform: rotate(0deg); }
												100% { transform: rotate(360deg); }
											}
										`}
									</style>
								</div>
							) : photoData && photoData.url ? (
								<img
									src={photoData.url}
									alt={"photo"}
									width={120}
									height={120}
									style={{ objectFit: "cover", width: 120, height: 120 }}
								/>
							) : (
								<img
									src="/images/icon.png"
									alt="photo"
									width={120}
									height={120}
									style={{ objectFit: "cover", width: 120, height: 120 }}
								/>
							)}

							<div className="upload__actions">
								<button
									type="button"
									className="btn btn--style-primary btn--icon-style-without-border btn--size-small"
									onClick={() => document.getElementById("photo-upload")?.click()}
									disabled={isUploading}
								>
									{/* @ts-ignore */}
									{i18n.t("app-users:uploadPhoto")}
								</button>
							</div>
						</div>

						<input
							id="photo-upload"
							type="file"
							accept="image/*"
							className="upload__input"
							style={{
								width: "0.1px",
								height: "0.1px",
								opacity: 0,
								overflow: "hidden",
								position: "absolute",
								zIndex: -1,
							}}
							onChange={async (e) => {
								const file = e.target.files?.[0];
								if (!file) return;

								setIsUploading(true);
								const formData = new FormData();
								formData.append("file", file);
								formData.append(
									"_payload",
									JSON.stringify({
										alt: "file.name",
									})
								);

								try {
									// First upload the media
									const mediaResponse = await fetch("/api/media", {
										method: "POST",
										body: formData,
									});

									if (mediaResponse.ok) {
										const mediaData = await mediaResponse.json();
										setPhotoData(mediaData.doc);
										
										// Then update the user with the new photo ID
										const userResponse = await fetch(`/api/app-users/${userId}`, {
											method: "PATCH",
											headers: {
												"Content-Type": "application/json",
											},
											body: JSON.stringify({
												photo: mediaData.doc.id
											})
										});

										if (!userResponse.ok) {
											throw new Error("Failed to update user photo");
										}
									}
								} catch (err) {
									console.error("Error updating photo:", err);
								} finally {
									setIsUploading(false);
								}
							}}
						/>
					</div>
				</div>
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
