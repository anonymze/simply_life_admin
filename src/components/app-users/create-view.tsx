"use client";

import type { AdminViewProps } from "payload";
import { Gutter, useTranslation } from "@payloadcms/ui";
import React, { useState } from "react";

import Fields from "./_fields";
import { z } from "zod";

export const CreateAppUserView: React.FC<AdminViewProps> = () => {
	const { i18n } = useTranslation();
	const [showErrorEmail, setShowErrorEmail] = useState(false);
	const [showErrorRole, setShowErrorRole] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get("email") as string;
		const role = formData.get("role") as string;

		if (!z.string().email().safeParse(email).success) {
			setShowErrorEmail(true);
		} else {	
			setShowErrorEmail(false);
		}

		if (!role) {
			setShowErrorRole(true);
		} else {
			setShowErrorRole(false);
		}

		if (showErrorEmail || showErrorRole) {
			return;
		}

			
	};

	return (
		<main className="collection-edit collection-edit--admins">
			<form action="" className="collection-edit__form form" method="POST" onSubmit={handleSubmit}>
				<div className="gutter--left gutter--right doc-controls">
					<div className="doc-controls__wrapper">
						<div className="doc-controls__content">
							<ul className="doc-controls__meta">
								<li className="doc-controls__list-item">
									{/* @ts-ignore */}
									<p className="doc-controls__value">{i18n.t("app-users:createNewUser")}</p>
								</li>
							</ul>
						</div>
						<div className="doc-controls__controls-wrapper">
							<div className="doc-controls__controls">
								<div className="form-submit">
									<button
										type="submit"
										id="action-save"
										className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
									>
										<span className="btn__content">
											<span className="btn__label">{i18n.t("general:save")}</span>
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="doc-controls__divider"></div>
				</div>
				<div className="document-fields document-fields--no-sidebar">
					<div className="document-fields__main">
						<Gutter className="document-fields__edit">
							<Fields showErrorRole={showErrorRole} showErrorEmail={showErrorEmail} />
						</Gutter>
					</div>
				</div>
			</form>
		</main>
	);
};

export default CreateAppUserView;
