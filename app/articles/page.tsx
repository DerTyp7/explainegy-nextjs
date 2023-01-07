import styles from "../../styles/modules/CategoryList.module.scss";
import Link from "next/link";
import { Category, Svg, Prisma } from "@prisma/client";
import urlJoin from "url-join";
import { apiUrl } from "../global";

type CategoryWithSvg = Prisma.CategoryGetPayload<{ include: { svg: true } }>;

export async function GetCategories(): Promise<any> {
  const result: Response = await fetch(urlJoin(apiUrl, `categories`), {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  return result.json();
}

export default async function CategoryList() {
  const categories = await GetCategories();
  return (
    <div className={styles.categoryList}>
      <h1>Overview</h1>
      <div className={styles.content}>
        <div className={styles.grid}>
          {categories?.length > 0
            ? categories.map((cat, i) => {
                return (
                  <div key={i} className={styles.linkContainer}>
                    <Link href={`/articles/${cat.name.toLowerCase()}`} style={{ backgroundColor: cat.color }}>
                      <div className={styles.svgContainer}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox={cat?.svg?.viewbox}>
                          <path d={cat?.svg?.path} />
                        </svg>
                      </div>
                      {cat.title}
                    </Link>
                  </div>
                );
              })
            : "We did not find any categories"}
        </div>
      </div>
    </div>
  );
}
