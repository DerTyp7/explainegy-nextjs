"use client";
import React, { useRef } from "react";
import styles from "../styles/Nav.module.scss";
import Image from "next/image";
import Link from "next/link";
import "../styles/test.css";
function switchTheme() {}

export default function Nav() {
	const switchThemeSvgRef = useRef();
	return (
		<nav className={styles.nav}>
			<div className="dark">
				<div className="test"></div>
			</div>

			<div className={styles.containerLeft}>
				<Image
					src={"/images/logo.svg"}
					height={40}
					width={160}
					alt="Nav bar logo"
				/>
				<div className={styles.links}>
					<Link href={"/tutorials"}>Tutorials</Link>
				</div>
			</div>
			<div className={styles.containerCenter}>
				<div className={styles.searchBar}>
					<div className={styles.icon}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
						</svg>
					</div>
					<input type="text" name="" id="" />
				</div>
			</div>
			<div className={styles.containerRight}>
				<div
					className={styles.themeSwitch}
					onClick={() => {
						switchTheme();
					}}
				>
					<svg
						ref={switchThemeSvgRef}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zm64 0c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" />
					</svg>
				</div>
			</div>
		</nav>
	);
}
