import { Article } from "@prisma/client";
import { FetchManager } from "../../../../manager/fetchManager";

export default async function ArticleHead({ params }: { params: { articleName: string; categoryName: string } }) {
  const articleName: string = params.articleName;
  const article: Article = await FetchManager.Article.getByName(articleName);
  return (
    <>
      <title>{article?.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
