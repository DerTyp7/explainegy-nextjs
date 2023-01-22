import React from "react";
import styles from "../../../../styles/modules/ArticleContentTable.module.scss";
import { Article } from "@prisma/client";
import { IContentTableEntry } from "../../../../types/contentTable";

export default function ContentTable({ contentTableData }: { contentTableData: any }) {
  return (
    <div className={styles.articleContentTable}>
      <div className={styles.stickyContainer}>
        <div className={styles.list}>
          <h2>Contents</h2>
          {contentTableData?.map((e, i) => {
            return (
              <a key={i} href={"#" + e.anchor}>
                {e.title}
              </a>
            );
          })}
        </div>
        {contentTableData?.length < 15 ? <div className={styles.adContainer}>Future advertisement</div> : ""}
      </div>
    </div>
  );
}
