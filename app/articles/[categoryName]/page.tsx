import styles from "../../../styles/modules/Category.module.scss";
import Link from "next/link";
import { ArticleWithIncludes, CategoryWithIncludes, FetchManager } from "../../../manager/fetchManager";
import { formatTextToUrlName } from "../../../utils";

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = formatTextToUrlName(params.categoryName);
  const category: CategoryWithIncludes = await FetchManager.Category.get(categoryName);

  const allArticles: ArticleWithIncludes[] = await FetchManager.Article.getByCategory(categoryName);
  // const popularArticles: Article[] = await GetPopularArticles(categoryName);
  // const recentArticles: Article[] = await GetRecentArticles(categoryName);

  return (
    <div className={styles.category}>
      <h1>{category?.title}</h1>
      <div className={styles.content}>
        <div className={`${styles.showcase} ${styles.smallShowcase}`}>
          <h2>Most popular articles</h2>
          {/* {popularArticles?.map((a, i) => {
            {
              return (
                <Link key={i} href={`/articles/${category.name}/${a.name}`}>
                  {a.title}
                </Link>
              );
            }
          })} */}
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
          {allArticles
            ? Array.from(allArticles).map((a, i) => {
                {
                  return (
                    <Link key={i} href={`/articles/${category.name}/${a.name}`}>
                      {a.title}
                    </Link>
                  );
                }
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
