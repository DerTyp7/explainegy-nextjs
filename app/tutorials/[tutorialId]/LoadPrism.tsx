"use client";
import React from "react";
import { useEffect } from "react";

import Prism from "prismjs";
import "../../../styles/prism_themes/prism-one-dark.css";
//import "../../../styles/prism_themes/prism-one-light.css";

export default function LoadPrism() {
	useEffect(() => {
		document.querySelectorAll("pre").forEach((pre) => {
			if (pre.classList.length < 1) {
				pre.classList.add("language-");
			}
		});
		Prism.highlightAll();
	}, []);
	return <div></div>;
}
