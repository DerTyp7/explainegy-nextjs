import ContentTable from "../../../../components/ContentTable";
import Sidebar from "../../../../components/Sidebar";
import styles from "../../../../styles/modules/Article.module.scss";
import Image from "next/image";
import Markdown from "../../../../components/Markdown";
import { ArticleWithIncludes, FetchManager } from "../../../../manager/fetchManager";
import { formatTextToUrlName } from "../../../../utils";

//* MAIN
export default async function ArticlePage({ params }: { params: { articleName: string; categoryName: string } }) {
  const articleName: string = formatTextToUrlName(params.articleName);
  const article: ArticleWithIncludes = await FetchManager.Article.getByName(articleName);

  const dateUpdated: Date = new Date(article.dateUpdated);
  const dateCreated: Date = new Date(article.dateCreated);
  const dateOptions: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  const markdown: string = article?.markdown ?? "";

  return (
    <div className={styles.article}>
      <ContentTable contentTableData={article.contentTable ? article.contentTable : []} />
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
      </div>
      <Sidebar />
    </div>
  );
}

export async function generateStaticParams() {
  // Fetchmanager does not work here
  const articles: ArticleWithIncludes[] = await FetchManager.Article.list(false);

  return await Promise.all(
    articles.map(async (article) => ({
      categoryName: article.category?.name ?? "",
      articleName: article.name ?? "",
    }))
  );
}
