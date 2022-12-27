import React from "react";
import styles from "../../styles/DynamicCategoryGrid.module.scss";
import Link from "next/link";
export default function DynamicCategoryGrid({ categories }) {
	return (
		<div className={styles.grid}>
			{categories.map((cat, i) => {
				{
					return (
						<div key={i} className={styles.linkContainer}>
							<Link href="#" style={{ backgroundColor: cat.color }}>
								<div className={styles.svgContainer}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
										<path d={cat.svg} />
									</svg>
								</div>
								{cat.name}
							</Link>
						</div>
					);
				}
			})}
		</div>
	);
}
