import styles from "@/styles/modules/Category.module.scss";
import Link from "next/link";
import { formatTextToUrlName } from "@/utils";
import { Article, Category } from "@prisma/client";
import prisma, { CategoryWithIncludes } from "@/lib/prisma";
import CategoryControl from "../../../components/CategoryControl";

export default function CategoryPage({ category }: { category: CategoryWithIncludes }) {
  return (
    <>
      <CategoryControl categoryId={category.id} />
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
            {category?.articles
              ? Array.from(category?.articles).map((a: Article, i: number) => {
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
    </>
  );
}
export async function getServerSideProps(context: any) {
  const categoryName = formatTextToUrlName(context.params.categoryName);

  let category: CategoryWithIncludes | null = null;

  await prisma.category
    .findUnique({
      where: { name: categoryName },
      include: { articles: true, svg: true },
    })
    .then(
      (result: CategoryWithIncludes | null) => {
        if (result) {
          category = JSON.parse(JSON.stringify(result));
        }
      },
      (reason: any) => {
        console.log(reason);
      }
    );

  return {
    props: { category: category }, // will be passed to the page component as props
  };
}
