import styles from "../../../styles/modules/Category.module.scss";
import Link from "next/link";
import prisma from "../../../lib/prisma";
import { Article, Category } from "@prisma/client";

export async function GetAllArticles(category: Category): Promise<Article[]> {
	return await prisma.article.findMany({ where: { category: category } });
}

export async function GetPopularArticles(
	category: Category
): Promise<Article[]> {
	return await prisma.article.findMany({
		where: { category: category },
		take: 6,
	});
}

export async function GetRecentArticles(
	category: Category
): Promise<Article[]> {
	return await prisma.article.findMany({
		where: { category: category },
		take: 6,
		orderBy: { dateCreated: "desc" },
	});
}

export async function GetCategory(categoryName: string): Promise<Category> {
	return await prisma.category.findUnique({ where: { name: categoryName } });
}
export default async function CategoryPage({
	params,
}: {
	params: { categoryName: string };
}) {
	const categoryName = params.categoryName.toLowerCase().replaceAll("%20", " ");
	const category: Category = await GetCategory(categoryName);
	const allArticles: Article[] = await GetAllArticles(category);
	const popularArticles: Article[] = await GetPopularArticles(category);
	const recentArticles: Article[] = await GetRecentArticles(category);

	return (
		<div className={styles.category}>
			<h1>{category?.title}</h1>
			<div className={styles.content}>
				<div className={`${styles.showcase} ${styles.smallShowcase}`}>
					<h2>Most popular articles</h2>
					{popularArticles?.map((a, i) => {
						{
							return (
								<Link key={i} href={`/articles/${category.name}/${a.name}`}>
									{a.name}
								</Link>
							);
						}
					})}
				</div>

				{/* <div className={`${styles.showcase} ${styles.smallShowcase}`}>
					<h2>Most recent articles</h2>
					{recentArticles?.map((a, i) => {
						{
							return (
								<Link key={i} href={`/articles/${category.name}/${a.name}`}>
									{a.name}
								</Link>
							);
						}
					})}
				</div> */}

				<div className={styles.showcase}>
					<h2>All articles</h2>
					{allArticles?.map((a, i) => {
						{
							return (
								<Link key={i} href={`/articles/${category.name}/${a.name}`}>
									{a.name}
								</Link>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
}
