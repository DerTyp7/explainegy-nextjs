import ContentTable from "@/components/ContentTable";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/modules/Article.module.scss";
import Image from "next/image";
import Markdown from "@/components/Markdown";
import { formatTextToUrlName } from "@/utils";
import prisma, { ArticleWithIncludes, CategoryWithIncludes } from "@/lib/prisma";
import articles from "../..";

//* MAIN
export default function ArticlePage({ article }: { article: ArticleWithIncludes }) {
  const dateUpdated: Date = new Date(article?.dateUpdated);
  const dateCreated: Date = new Date(article?.dateCreated);
  const dateOptions: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };

  return (
    <div className={styles.article}>
      <ContentTable contentTableData={article?.contentTable ? article?.contentTable : []} />
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
          <Image src={""} height={350} width={750} alt={""} quality={100} placeholder="blur" blurDataURL="/images/blur.png" loading="lazy" />
          <p>{article?.introduction}</p>
        </div>
        <Markdown value={article?.markdown ?? ""} />
      </div>
      <Sidebar />
    </div>
  );
}

export async function generateStaticParams() {
  let articles: ArticleWithIncludes[] = [];

  await prisma.article.findMany({ include: { category: true } }).then(
    (result: ArticleWithIncludes[]) => {
      if (result) {
        articles = result;
      }
    },
    (reason: any) => {
      console.log(reason);
    }
  );

  return await Promise.all(
    articles.map(async (article) => ({
      article: article,
    }))
  );
}

export async function getServerSideProps(context: any) {
  const articleName = formatTextToUrlName(context.params.articleName);

  let article: ArticleWithIncludes | null = null;

  await prisma.article
    .findUnique({
      where: { name: articleName },
      include: { category: true },
    })
    .then(
      (result: ArticleWithIncludes | null) => {
        if (result) {
          article = JSON.parse(JSON.stringify(result));
        }
      },
      (reason: any) => {
        console.log(reason);
      }
    );

  return {
    props: { article: article }, // will be passed to the page component as props
  };
}