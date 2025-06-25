"use client";

import { useDocumentInfo, useField } from "@payloadcms/ui";
import { UIFieldClientProps } from "payload";
import React from "react";
import { FullscreenLoader } from "./fullscreen-loader";

export default function CommissionAutoFill(props: UIFieldClientProps) {
	const [loading, setLoading] = React.useState(false);
	const document = useDocumentInfo();

	console.log("document")
	console.log(document.id);

	const { setValue: setValueEncours } = useField<number>({
		path: "informations.encours",
	});
	const { setValue: setValueProduction } = useField<number>({
		path: "informations.production",
	});
	const { setValue: setValueStructuredProduct } = useField<number>({
		path: "informations.up_front",
	});

	const { value: supplierValue } = useField<string>({ path: "supplier" });
	const { value: appUserValue } = useField<string>({ path: "app_user" });

	React.useEffect(() => {
		if (document.id) return;
		async function fetchAsync() {
			try {
				setLoading(true);
				const response = await fetch(`/api/globals/commission-imports/${supplierValue}/${appUserValue}`);
				const data = (await response.json()) as {
					totalEncours: number;
					totalProduction: number;
					totalStructuredProduct: number;
				};
				setValueEncours(data.totalEncours);
				setValueProduction(data.totalProduction);
				setValueStructuredProduct(data.totalStructuredProduct);
				setLoading(false);
			} catch {
				setLoading(false);
			}
		}
		fetchAsync();
	}, [supplierValue, appUserValue, document.id]);

	return <FullscreenLoader isVisible={loading} message={"Récupération des données..."} />;
}
