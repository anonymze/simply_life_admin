"use client";

import { enum_app_users_role } from "@/payload-generated-schema";
import { AppUser } from "@/payload-types";
import { FieldLabel, SelectInput, TextInput, useTranslation } from "@payloadcms/ui";
import React, { useState } from "react";

export default function Fields() {
	const { i18n } = useTranslation();

	const [email, setEmail] = useState("");
	const [role, setRole] = useState<AppUser["role"]>("associate");
	const [emailError, setEmailError] = useState<string | null>(null);


	React.useEffect(() => {
		if (!email) return;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setEmailError("Invalid email address");
		} else {
			setEmailError(null);
		}
	}, [email]);

	return (
		<div className="render-fields document-fields__fields">
			<div className="field-type text">
				<FieldLabel label="Email" required />
				<TextInput
					path="email"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					value={email}
					required
				/>
				{emailError && <p className="error">{emailError}</p>}
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelRole")} required />
				<SelectInput
					name="role"
					path="role"
					options={enum_app_users_role.enumValues.map((value) => ({
						// @ts-ignore
						label: i18n.t(`app-users:${value}`),
						value,
					}))}
					value={role}
					onChange={(option) => {
						// @ts-ignore
						setRole(option.value);
					}}
					required
				/>
			</div>
		</div>
	);
}
