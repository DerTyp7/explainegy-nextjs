import { Article } from "@prisma/client";
import { GetArticle } from "./page";

export default async function Head({
	params,
}: {
	params: { articleName: string };
}) {
	const articleName: string = params.articleName;
	const article: Article = await GetArticle(articleName);
	return (
		<>
			<title>{article.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</>
	);
}
