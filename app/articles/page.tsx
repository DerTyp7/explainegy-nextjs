import styles from "../../styles/CategoryList.module.scss";
import Link from "next/link";
import prisma from "../../lib/prisma";
import { Category } from "@prisma/client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

export async function GetCategories(): Promise<Category[]> {
	return await prisma.category.findMany();
}

export default async function CategoryList() {
	const categories = await GetCategories();

	return (
		<div className={styles.categoryList}>
			<h1>Overview</h1>
			<div className={styles.content}>
				<div className={styles.grid}>
					{categories.map((cat, i) => {
						return (
							<div key={i} className={styles.linkContainer}>
								<Link
									href={`/articles/${cat.name.toLowerCase()}`}
									style={{ backgroundColor: cat.color }}
								>
									<div className={styles.svgContainer}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 640 512"
										>
											<path d={cat.svg} />
										</svg>
									</div>
									{cat.name}
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
