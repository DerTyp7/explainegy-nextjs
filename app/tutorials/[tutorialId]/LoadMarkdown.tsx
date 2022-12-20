"use client";
import React from "react";
import { useEffect } from "react";

import Prism from "prismjs";
import "../../../styles/prism_themes/prism-one-dark.css";
//import "../../../styles/prism_themes/prism-one-light.css";

export default function LoadMarkdown() {
	useEffect(() => {
		document.querySelectorAll("pre").forEach((pre) => {
			if (pre.classList.length < 1) {
				pre.classList.add("language-");
			}
		});

		document.querySelectorAll("blockquote").forEach((bq) => {
			bq.classList.add("blockquote");
		});

		document.querySelectorAll("li").forEach((li) => {
			let paragraphText = "";
			li.querySelectorAll("p").forEach((p) => {
				paragraphText = p.innerHTML;
			});

			if (paragraphText != "") {
				li.innerHTML = paragraphText;
			}
		});

		Prism.highlightAll();
	}, []);
	return <div></div>;
}
