"use client";

import { enum_app_users_role } from "@/payload-generated-schema";
import { AppUser } from "@/payload-types";
import { FieldLabel, SelectInput, TextInput, useTranslation } from "@payloadcms/ui";
import React, { useState } from "react";

export default function Fields({
	showErrorRole = false,
	showErrorEmail = false,
}: {
	showErrorRole?: boolean;
	showErrorEmail?: boolean;
}) {
	const { i18n } = useTranslation();

	const [email, setEmail] = useState("");
	const [role, setRole] = useState<AppUser["role"]>("associate");

	return (
		<div className="render-fields document-fields__fields">
			<div className="field-type text">
				<FieldLabel label="Email" required />
				<TextInput
					path="email"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					value={email}
					showError={showErrorEmail}
					required
				/>
			</div>
			<div className="field-type text">
				{/* @ts-ignore */}
				<FieldLabel label={i18n.t("app-users:labelRole")} required />
				<SelectInput
					showError={showErrorRole}
					isClearable={false}
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
				<input type="hidden" name="role" value={role} />
			</div>
		</div>
	);
}
