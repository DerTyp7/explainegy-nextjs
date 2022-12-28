import React from "react";
import styles from "../styles/modules/Footer.module.scss";
import Image from "next/image";
export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.adContainer}>Future advertisement</div>
			<div className={styles.content}>
				<div className={styles.company}>
					<Image
						src={"/images/logo.svg"}
						width={190}
						height={52}
						alt={"Logo"}
					/>
					<h1>Simple tutorials for everyone!</h1>
				</div>
				<div className={styles.links}>
					<div className={styles.grid}>
						<a href="#">Tutorials</a>
						<a href="#">Contact</a>
						<a href="#">About</a>

						<a></a>
						<a href="#">Report Bug</a>
						<a href="#">Legal</a>

						<a></a>
						<a href="#">Feedback</a>
						<a href="#">Privacy</a>

						<a></a>
						<a></a>
						<a href="#">Cookies</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
