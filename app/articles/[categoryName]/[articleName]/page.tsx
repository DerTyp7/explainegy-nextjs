import { marked } from "marked";
import ContentTable from "./ContentTable";
import Sidebar from "./Sidebar";
import styles from "../../../../styles/Tutorial.module.scss";
import LoadMarkdown from "./LoadMarkdown";
import prisma from "../../../../lib/prisma";
import { Article, Category, ContentTableEntry } from "@prisma/client";

export async function GetContentTableEntries(
	article: Article
): Promise<ContentTableEntry[]> {
	const entries = await prisma.contentTableEntry.findMany({
		where: { article: article },
		orderBy: { orderIndex: "asc" },
	});

	return entries;
}

export async function GetArticle(articleName: string) {
	const article = await prisma.article.findUnique({
		where: { name: articleName.toLowerCase() },
	});

	return article;
}

function ParseMarkdown(markdown: string): string {
	let result = marked.parse(markdown);

	return result;
}

//* MAIN
export default async function Tutorial({
	params,
}: {
	params: { articleName: string; categoryName: string };
}) {
	const articleName: string = params.articleName;
	const article: Article = await GetArticle(articleName);
	const markdown: string = article.markdown;
	const contentTableEntries: ContentTableEntry[] = await GetContentTableEntries(
		article
	);

	return (
		<div className={styles.tutorial}>
			<ContentTable contentTableEntries={contentTableEntries} />
			<div className={styles.tutorialContent}>
				<div className={styles.head}>
					<h1>{article.title}</h1>
				</div>
				<div
					className="markdown"
					dangerouslySetInnerHTML={{
						__html: ParseMarkdown(markdown),
					}}
				></div>
				<LoadMarkdown />
			</div>
			<Sidebar />
		</div>
	);
}

export async function generateStaticParams() {
	const articles = await prisma.article.findMany();

	async function GetCategory(categoryId: number): Promise<Category> {
		return await prisma.category.findUnique({ where: { id: categoryId } });
	}

	return await Promise.all(
		articles.map(async (article) => ({
			categoryName: (await GetCategory(article.categoryId)).name ?? "",
			articleName: article.name ?? "",
		}))
	);
}
