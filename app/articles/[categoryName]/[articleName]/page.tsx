import { marked } from "marked";
import ContentTable from "./ContentTable";
import Sidebar from "./Sidebar";
import styles from "../../../../styles/modules/Article.module.scss";
import LoadMarkdown from "./LoadMarkdown";
import { Article, Category, ContentTableEntry } from "@prisma/client";
import Image from "next/image";
import urlJoin from "url-join";
import { apiUrl } from "../../../global";
import { Prisma } from "@prisma/client";

type ArticleWithContentTableEntries = Prisma.ArticleGetPayload<{ include: { contentTableEntries: true } }>;
type ArticleWithCategory = Prisma.ArticleGetPayload<{ include: { category: true } }>;

// export async function GetContentTableEntries(article: Article): Promise<ContentTableEntry[]> {
//   const entries = await prisma.contentTableEntry.findMany({
//     where: { articleId: article?.id ?? 1 },
//     orderBy: { orderIndex: "asc" },
//   });

//   return entries;
// }

export async function GetArticle(articleName: string): Promise<any> {
  const result: Response = await fetch(urlJoin(apiUrl, `articles/${articleName ?? ""}`), {
    cache: "force-cache",
    next: { revalidate: 60 * 10 },
  });

  return result.json();
}

function ParseMarkdown(markdown: string): string {
  let result = marked.parse(markdown);
  return result;
}

//* MAIN
export default async function ArticlePage({ params }: { params: { articleName: string; categoryName: string } }) {
  const articleName: string = params.articleName.toLowerCase().replaceAll("%20", " ");
  const article: ArticleWithContentTableEntries = await GetArticle(articleName);
  const markdown: string = article?.markdown ?? "";

  return (
    <div className={styles.article}>
      <ContentTable contentTableEntries={article.contentTableEntries} />
      <div className={styles.tutorialContent}>
        <div className={styles.header}>
          <p className="text-muted">Published on January 13, 2022</p>

          <h1>{article?.title}</h1>
          <div className={styles.tags}>
            <a href="#">Docker</a> <a href="#">Setup</a> <a href="#">Ubuntu</a>
          </div>
          <Image
            src={"/images/test.jpg"}
            height={350}
            width={750}
            alt="Image"
            quality={100}
            placeholder="blur"
            blurDataURL="/images/blur.png"
            loading="lazy"
          />
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
  const articles: ArticleWithCategory[] = await (
    await fetch(urlJoin(apiUrl, `articles/`), {
      cache: "force-cache",
      next: { revalidate: 60 * 10 },
    })
  ).json();

  return await Promise.all(
    articles.map(async (article) => ({
      categoryName: article.category?.name ?? "",
      articleName: article.name ?? "",
    }))
  );
}
