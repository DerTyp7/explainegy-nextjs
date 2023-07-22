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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox={cat?.svg?.viewbox.length > 0 ? cat?.svg?.viewbox : "0 0 512 512"}>
                          <path
                            d={
                              cat?.svg?.path.length > 0
                                ? cat?.svg?.path
                                : "M0 64C0 46.3 14.3 32 32 32H88h48 56c17.7 0 32 14.3 32 32s-14.3 32-32 32V400c0 44.2-35.8 80-80 80s-80-35.8-80-80V96C14.3 96 0 81.7 0 64zM136 96H88V256h48V96zM288 64c0-17.7 14.3-32 32-32h56 48 56c17.7 0 32 14.3 32 32s-14.3 32-32 32V400c0 44.2-35.8 80-80 80s-80-35.8-80-80V96c-17.7 0-32-14.3-32-32zM424 96H376V256h48V96z"
                            }
                          />
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
