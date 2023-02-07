import React from "react";
import styles from "@/styles/modules/Sidebar.module.scss";
export default function Sidebar() {
	return (
		<div className={styles.sidebar}>
			<div className={styles.stickyContainer}>
				<div className={styles.sidebarContainer}>
					<h3>Popular</h3>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
				</div>

				<div className={styles.sidebarContainer}>
					<h3>Related</h3>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
					<a href="#"> Set up Docker</a>
				</div>
				<div className={styles.adContainer}>Future advertisement</div>
			</div>
		</div>
	);
}
