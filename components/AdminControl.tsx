"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "../styles/modules/AdminControl.module.scss";
import "../styles/buttons.scss";

export default function AdminControl() {
  const router = useRouter();
  const [isArticle, setIsArticle] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [articleOrCategoryName, setArticleOrCategoryName] = useState("");
  const [articleOrCategoryId, setArticleOrCategoryId] = useState();
  const pathname = usePathname();

  async function fetchDelete() {
    const response = await fetch(
      `/api/${isArticle ? "articles" : isCategory ? "categories" : ""}/${articleOrCategoryId}`,
      {
        method: "DELETE",
        cache: "no-cache",
      }
    );
    router.push("/articles/");
  }

  useEffect(() => {
    function checkArticlePage() {
      let path = pathname.split("/");
      if (path.length == 4) {
        if (path[1] == "articles") {
          setIsArticle(true);
          setArticleOrCategoryName(path[3]);
          return;
        }
      }

      setIsArticle(false);
    }

    function checkCategoryPage() {
      let path = pathname.split("/");
      if (path.length == 3) {
        if (path[1] == "articles") {
          setIsCategory(true);
          setArticleOrCategoryName(path[2]);
          return;
        }
      }

      setIsCategory(false);
    }
    checkArticlePage();
    checkCategoryPage();
  }, [pathname]);

  useEffect(() => {
    async function getArticleOrCategoryId() {
      const response = await fetch(
        `/api/${isArticle ? "articles" : isCategory ? "categories" : ""}/name/${articleOrCategoryName}`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      const json = await response.json();

      setArticleOrCategoryId(json.id);
    }
    getArticleOrCategoryId();
  }, [articleOrCategoryName]);
  return (
    <div className={styles.adminControl}>
      {isArticle || isCategory ? (
        <>
          <button
            className="danger"
            onClick={() => {
              fetchDelete();
            }}
          >
            Delete this {isArticle ? "article" : "category"}
          </button>
          <button
            className="warning"
            onClick={() => {
              router.push(`/admin/${isArticle ? "articles" : "categories"}/editor/${articleOrCategoryId}`);
            }}
          >
            Edit this {isArticle ? "article" : "category"}
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
