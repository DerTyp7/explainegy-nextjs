"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import styles from "../../../../../styles/modules/ArticleEditor.module.scss";
import { Prisma } from "@prisma/client";
import "../../../../../styles/inputs.scss";
import "../../../../../styles/buttons.scss";
import Select from "react-select";
import { useRouter } from "next/navigation";
import urlJoin from "url-join";
import { IContentTableEntry } from "../../../../../types/contentTable";
import { CreateArticle, UpdateArticle } from "../../../../../types/api";
import { formatTextToUrlName } from "../../../../../utils";
import { isValidText } from "../../../../../validators";
import { apiUrl } from "../../../../../global";
import Markdown from "../../../../../components/Markdown";

type ArticleWithCategory = Prisma.ArticleGetPayload<{ include: { category: true } }>;

export default function AdminArticlesEditorPage({ params }: { params: { articleId: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [selectCategoriesOptions, setSelectCategoriesOptions] = useState<any>([]);
  const [introduction, setIntroduction] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [contentTable, setContentTable] = useState<any>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef(null);
  const introductionRef = useRef<HTMLInputElement>(null);
  const markdownTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const errorTextRef = useRef(null);

  function changeContentTableEntryAnchor(index: number, newAnchor: string) {
    setContentTable((prevArray) => {
      let newArray = [...prevArray];
      newArray[index].anchor = newAnchor;
      return newArray;
    });
  }

  function changeContentTableEntryTitle(index: number, newTitle: string) {
    setContentTable((prevArray) => {
      let newArray = [...prevArray];
      newArray[index].anchor = newTitle;
      return newArray;
    });
  }

  function removeEntry(index: number) {
    let newArray = [...contentTable];
    newArray.splice(index, 1);
    setContentTable(newArray);
  }

  function handleFormChange() {
    setMarkdown(markdownTextAreaRef.current.value);
    setTitle(titleRef.current.value);
    setIntroduction(introductionRef.current.value);
  }

  // Create or update article
  async function handleResponse(res: Response) {
    const json = await res.json();
    errorTextRef.current.innerText = json.error ?? "";
    if (json.success) {
      const newArticle: ArticleWithCategory = json.data;
      router.push(urlJoin(`/articles/`, newArticle.category.name, newArticle.name));
    }
  }

  async function updateArticle() {
    console.log("Update article");
    const payload: UpdateArticle = {
      title: titleRef.current.value,
      introduction: introductionRef.current.value,
      markdown: markdown,
      categoryId: Number(categorySelectRef?.current?.getValue()[0]?.value),
      contentTable: contentTable,
    };
    console.log(payload);

    await fetch(`/api/articles/${params.articleId.toString()}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(console.error);
  }

  async function createArticle() {
    console.log("Create article");
    const payload: CreateArticle = {
      title: titleRef.current.value,
      introduction: introductionRef.current.value,
      markdown: markdown,
      categoryId: Number(categorySelectRef?.current?.getValue()[0]?.value),
      contentTable: contentTable,
    };
    console.log(payload);

    await fetch("/api/articles/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(console.error);
  }

  // App
  useEffect(() => {
    const fetchExistingArticle = async () => {
      const result: Response = await fetch(urlJoin(apiUrl, `articles/${params.articleId}`), {
        cache: "no-cache",
        next: { revalidate: 60 * 1 },
      });

      const article = await result.json();
      console.log(article);
      if (article.code == "404") {
        router.push(urlJoin(`/admin/articles/editor/0`));
      } else {
        titleRef.current.value = article.title;
        introductionRef.current.value = article.introduction;
        markdownTextAreaRef.current.value = article.markdown;
        categorySelectRef.current.setValue({ value: article.category.id, label: article.category.title });

        setTitle(article.title);
        setIntroduction(article.introduction);
        setMarkdown(article.markdown);
        setContentTable(article.contentTable);
      }
    };

    const fetchCategoryOptions = async () => {
      const result: Response = await fetch(urlJoin(apiUrl, `categories`), {
        cache: "no-cache",
        next: { revalidate: 60 * 1 },
      });

      const categories = await result.json();
      let newSelectCategoriesOptions = [];

      categories?.forEach((c) => {
        newSelectCategoriesOptions.push({ value: c.id, label: c.title });
      });
      setSelectCategoriesOptions(newSelectCategoriesOptions);
    };

    fetchCategoryOptions().catch((err) => {
      console.log(err);
    });

    if (params.articleId != "0") {
      fetchExistingArticle().catch((err) => {
        console.log(err);
      });
    }
  }, []);

  return (
    <div className={styles.adminArticlesCreate}>
      <h1>{params.articleId == "0" ? "Create new article" : "Update article"}</h1>
      <div className={styles.formControl}>
        <p className="text-error" ref={errorTextRef}></p>
        <button
          type="button"
          onClick={() => {
            if (params.articleId != "0") {
              updateArticle();
            } else {
              createArticle();
            }
          }}
        >
          {params.articleId == "0" ? "Create article" : "Update article"}
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.articleEditor}>
          <div className={styles.title}>
            <label htmlFor="title">Title</label>

            <div className={styles.titleInputs}>
              <input
                onChange={handleFormChange}
                className={!isValidText(title) && title ? "error" : ""}
                type="text"
                name="title"
                placeholder="title"
                ref={titleRef}
              />
              <input
                readOnly={true}
                onChange={handleFormChange}
                className={""}
                type="text"
                name="name"
                value={title ? formatTextToUrlName(title) : ""}
              />
            </div>
          </div>
          <div className={styles.category}>
            <label htmlFor="title">Category</label>
            <Select
              ref={categorySelectRef}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={handleFormChange}
              options={selectCategoriesOptions}
            />
          </div>
          <div className={styles.introduction}>
            <label htmlFor="title">Introduction</label>
            <input
              onChange={handleFormChange}
              className={!isValidText(introduction) && introduction ? "error" : ""}
              type="text"
              name="introduction"
              placeholder="Introduction"
              ref={introductionRef}
            />
          </div>
          <div className={styles.markdown}>
            <label htmlFor="">Markdown Editor</label>
            <div className={styles.markdownEditor}>
              <textarea ref={markdownTextAreaRef} onChange={handleFormChange}></textarea>
              <Markdown value={markdown} />
            </div>
          </div>

          <div className={styles.contentTable}>
            <label htmlFor="">Table of contents</label>
            <div className={styles.contentTableEditor}>
              <div className={styles.entries}>
                {contentTable?.map((entry: IContentTableEntry, i: number) => {
                  return (
                    <div key={i}>
                      <input
                        onChange={(e) => {
                          changeContentTableEntryAnchor(i, e.target.value);
                        }}
                        type="text"
                        placeholder={"Anchor"}
                        defaultValue={entry.anchor}
                      />
                      <input
                        onChange={(e) => {
                          changeContentTableEntryTitle(i, e.target.value);
                        }}
                        type="text"
                        placeholder={"Title"}
                        defaultValue={entry.title}
                      />{" "}
                      <button
                        onClick={() => {
                          removeEntry(i);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setContentTable([...contentTable, { title: "", anchor: "" }]);
                  }}
                >
                  Add
                </button>
              </div>
              <Markdown value={markdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
