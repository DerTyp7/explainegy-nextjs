import React from "react";
import styles from "@/styles/modules/ArticleContentTable.module.scss";
import { IContentTableEntry } from "../types/contentTable";
import { CLIENT_RENEG_LIMIT } from "tls";

export default function ContentTable({ contentTableData }: { contentTableData: IContentTableEntry[] }) {
  console.log(contentTableData);
  return (
    <div className={styles.articleContentTable}>
      <div className={styles.stickyContainer}>
        <div className={styles.list}>
          <h2>Contents</h2>
          {contentTableData.map((e: IContentTableEntry, i: number) => {
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
