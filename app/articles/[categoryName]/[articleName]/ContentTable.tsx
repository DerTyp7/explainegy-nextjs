import React from "react";
import prisma from "../../../../lib/prisma";
import styles from "../../../../styles/TutorialContentTable.module.scss";
import { Article, ContentTableEntry } from "@prisma/client";

export default function ContentTable({
	contentTableEntries,
}: {
	contentTableEntries: ContentTableEntry[];
}) {
	return (
		<div className={styles.tutorialContentTable}>
			<div className={styles.stickyContainer}>
				<div className={styles.list}>
					<h2>Contents</h2>
					{contentTableEntries?.map((e, i) => {
						return (
							<a key={i} href={"#" + e.anchor}>
								{e.title}
							</a>
						);
					})}
				</div>
				{contentTableEntries?.length < 15 ? (
					<div className={styles.adContainer}>Future advertisement</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
