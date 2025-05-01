"use client"

import { UIFieldClientProps, UIFieldServerProps } from "payload";
import React from "react";


export default function DatesFilter(props: UIFieldClientProps) {

	React.useEffect(() => {
		const startTimeElement = document.getElementById(".dates-filter-start-time input");
		const endTimeElement = document.getElementById(".dates-filter-end-time input");


		console.log(startTimeElement, endTimeElement);
		
		}, []);
		return null;
}
