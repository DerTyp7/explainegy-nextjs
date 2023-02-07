import styles from "@/styles/modules/CategoryList.module.scss";
import Link from "next/link";
import { Category } from "@prisma/client";
import prisma, { CategoryWithIncludes } from "@/lib/prisma";

export default function CategoryList({ categories }: { categories: CategoryWithIncludes[] }) {
  return (
    <div className={styles.categoryList}>
      <h1>Overview</h1>
      <div className={styles.content}>
        <div className={styles.grid}>
          {categories?.length > 0
            ? categories.map((cat: CategoryWithIncludes, i: number) => {
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

export async function getServerSideProps() {
  let categories: CategoryWithIncludes[] = [];
  await prisma.category.findMany({ include: { articles: true, svg: true } }).then(
    (result: CategoryWithIncludes[]) => {
      if (result) {
        categories = JSON.parse(JSON.stringify(result));
      }
    },
    (reason: any) => {
      console.log(reason);
    }
  );

  return {
    props: { categories: categories }, // will be passed to the page component as props
  };
}
