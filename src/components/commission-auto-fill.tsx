"use client";

import { useField } from "@payloadcms/ui";
import { UIFieldClientProps } from "payload";
import React from "react";
import { FullscreenLoader } from "./fullscreen-loader";

export default function CommissionAutoFill(props: UIFieldClientProps) {
	const [loading, setLoading] = React.useState(true);

	const { value: valueEncours, setValue: setValueEncours } = useField<number>({
		path: "informations.encours",
	});
	const { value: valueProduction, setValue: setValueProduction } = useField<number>({
		path: "informations.production",
	});
	const { value: valueStructuredProduct, setValue: setValueStructuredProduct } = useField<number>({
		path: "informations.up_front",
	});

	const { value: supplierValue } = useField<string>({ path: "supplier" });
	const { value: appUserValue } = useField<string>({ path: "app_user" });

	React.useEffect(() => {
		async function fetchAsync() {
			try {
				const response = await fetch(`/api/commission-imports/${supplierValue}/${appUserValue}`);
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
	}, []);

	return <FullscreenLoader isVisible={loading} message={"Récupération des données..."} />;
}
