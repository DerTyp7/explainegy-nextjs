import React from "react";
import { TutorialMeta } from "./page";
import styles from "../../../styles/TutorialContentTable.module.scss";

export default function ContentTable({
	tutorialMeta,
}: {
	tutorialMeta: TutorialMeta;
}) {
	return (
		<div className={styles.tutorialContentTable}>
			<div className={styles.stickyContainer}>
				<div className={styles.list}>
					<h2>Contents</h2>
					{tutorialMeta?.contentTable?.map((e, i) => {
						return (
							<a key={i} href={"#" + e.anchor}>
								{e.title}
							</a>
						);
					})}
				</div>
				{tutorialMeta?.contentTable?.length < 15 ? (
					<div className={styles.adContainer}>Future advertisement</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
