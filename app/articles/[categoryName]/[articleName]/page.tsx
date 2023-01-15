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
import Markdown from "../../../Markdown";

type ArticleWithIncludes = Prisma.ArticleGetPayload<{
  include: { contentTableEntries: true; category: true; image: true };
}>;

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
  const article: ArticleWithIncludes = await GetArticle(articleName);
  const dateUpdated: Date = new Date(article.dateUpdated);
  const dateCreated: Date = new Date(article.dateCreated);
  const dateOptions: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  const markdown: string = article?.markdown ?? "";

  return (
    <div className={styles.article}>
      <ContentTable contentTableEntries={article.contentTableEntries} />
      <div className={styles.tutorialContent}>
        <div className={styles.header}>
          <p className={`${styles.dates} text-muted`}>
            {`Published on ${dateCreated.toLocaleDateString("en-US", dateOptions)}`}
            <br />
            {dateUpdated > dateCreated ? `Updated on ${dateUpdated.toLocaleDateString("en-US", dateOptions)}` : ""}
          </p>

          <h1>{article?.title}</h1>
          <div className={styles.tags}>
            <a href="#">Docker</a> <a href="#">Setup</a> <a href="#">Ubuntu</a>
          </div>
          <Image
            src={article?.image?.url ?? ""}
            height={350}
            width={750}
            alt={article?.image?.alt ?? ""}
            quality={100}
            placeholder="blur"
            blurDataURL="/images/blur.png"
            loading="lazy"
          />
          <p>{article?.introduction}</p>
        </div>
        <Markdown value={markdown} />

        {/* <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: ParseMarkdown(markdown),
          }}
        ></div>
        <LoadMarkdown /> */}
      </div>
      <Sidebar />
    </div>
  );
}

export async function generateStaticParams() {
  const articles: ArticleWithIncludes[] = await (
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
