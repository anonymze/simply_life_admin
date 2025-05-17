import type { AdminViewProps } from "payload";
import { Gutter } from "@payloadcms/ui";
import React from "react";

import Fields from "./_fields";


export const CreateAppUserView: React.FC<AdminViewProps> = ({ initPageResult, params, searchParams }) => {
	const { t } = initPageResult.req.i18n;


	return (
		<main className="collection-edit collection-edit--admins">
			<form action="" className="collection-edit__form form" method="POST" noValidate={undefined}>
				<div className="gutter--left gutter--right doc-controls">
					<div className="doc-controls__wrapper">
						<div className="doc-controls__content">
							<ul className="doc-controls__meta">
								<li className="doc-controls__list-item">
									{/* @ts-ignore */}
									<p className="doc-controls__value">{t("app-users:createNewUser")}</p>
								</li>
							</ul>
						</div>
						<div className="doc-controls__controls-wrapper">
							<div className="doc-controls__controls">
								<div className="form-submit">
									<button
										type="button"
										id="action-save"
										className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
									>
										<span className="btn__content">
											<span className="btn__label">{t("general:save")}</span>
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
							<Fields />             
            </Gutter>
					</div>
				</div>
			</form>
		</main>
	);
};

export default CreateAppUserView;
