import styles from "../../styles/CategoryList.module.scss";
import Link from "next/link";
import prisma from "../../lib/prisma";
import { Category } from "@prisma/client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

export async function GetCategories(): Promise<Category[]> {
	return await prisma.category.findMany();
}

const DynamicCategoryGrid = dynamic(() => import("./DynamicCategoryGrid"), {
	loading: () => <p>Loading...</p>,
});

export default async function CategoryList() {
	const categories = await GetCategories();

	return (
		<div className={styles.categoryList}>
			<h1>Overview</h1>
			<div className={styles.content}>
				<DynamicCategoryGrid categories={categories} />
			</div>
		</div>
	);
}
