import styles from "../../../styles/modules/Category.module.scss";
import Link from "next/link";
import { apiUrl } from "../../global";
import { Article, Category } from "@prisma/client";
import urlJoin from "url-join";

async function GetAllArticles(categoryName: string): Promise<any> {
  const result: Response = await fetch(urlJoin(apiUrl, `articles?categoryName=${categoryName}`), {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  return result.json();
}

async function GetPopularArticles(categoryName: string): Promise<any> {
  const result: Response = await fetch(
    urlJoin(apiUrl, `articles?categoryName=${categoryName}&limit=6&orderBy=popularity`),
    {
      cache: "force-cache",
      next: { revalidate: 3600 },
    }
  );
  return result.json();
}

async function GetRecentArticles(categoryName: string): Promise<any> {
  const result: Response = await fetch(
    urlJoin(apiUrl, `articles?categoryName=${categoryName}&limit=6&orderBy=recent`),
    {
      cache: "force-cache",
      next: { revalidate: 3600 },
    }
  );
  return result.json();
}

async function GetCategory(categoryName: string): Promise<any> {
  const result: Response = await fetch(urlJoin(apiUrl, `categories/name/${categoryName}`), {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  return result.json();
}

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = params.categoryName.toLowerCase().replaceAll("%20", " ");
  const category: Category = await GetCategory(categoryName);
  const allArticles: Article[] = await GetAllArticles(categoryName);
  const popularArticles: Article[] = await GetPopularArticles(categoryName);
  const recentArticles: Article[] = await GetRecentArticles(categoryName);

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
                  {a.title}
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
                  {a.title}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
