"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import styles from "../../../../styles/modules/AdminArticlesCreate.module.scss";
import { PostArticle } from "../../../../types/postData";
import Markdown from "../../../Markdown";
import { Article, Category, Prisma } from "@prisma/client";
import "../../../../styles/inputs.scss";
import "../../../../styles/buttons.scss";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { apiUrl } from "../../../global";
import urlJoin from "url-join";
import { formatTextToUrlName } from "../../../../utils";
import { isValidText } from "../../../../validators";
import { useRouter } from "next/navigation";
import ContentTable from "../../../articles/[categoryName]/[articleName]/ContentTable";
import { IContentTableEntry } from "../../../../types/contentTable";

type ArticleWithCategory = Prisma.ArticleGetPayload<{ include: { category: true } }>;

export default function AdminArticlesCreate() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [selectCategoriesOptions, setSelectCategoriesOptions] = useState<any>([]);
  const [introduction, setIntroduction] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [contentTable, setContentTable] = useState<IContentTableEntry[]>([]);

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

  function handleFormChange() {
    setMarkdown(markdownTextAreaRef.current.value);
    setTitle(titleRef.current.value);
    setIntroduction(introductionRef.current.value);
  }

  async function postData() {
    const formData: PostArticle = {
      title: titleRef.current.value,
      introduction: introductionRef.current.value,
      markdown: markdown,
      categoryId: Number(categorySelectRef?.current?.getValue()[0]?.value),
      contentTable: contentTable,
    };
    console.log(formData);
    const result = await fetch("/api/articles/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const response = await result.json();
    console.log(response);
    errorTextRef.current.innerText = response.error ?? "";
    if (response.success) {
      const newArticle: ArticleWithCategory = response.data;
      router.push(urlJoin(`/articles/`, newArticle.category.name, newArticle.name));
    }
  }

  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.adminArticlesCreate}>
      <h1>Create a new article</h1>
      <div className={styles.formControl}>
        <p className="text-error" ref={errorTextRef}></p>
        <button
          type="button"
          onClick={() => {
            postData();
          }}
        >
          Create Article
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
                {contentTable.map((entry: IContentTableEntry, i: number) => {
                  return (
                    <div key={i}>
                      <input
                        onChange={(e) => {
                          changeContentTableEntryAnchor(i, e.target.value);
                        }}
                        type="text"
                        placeholder={"Anchor"}
                      />
                      <input
                        onChange={(e) => {
                          changeContentTableEntryTitle(i, e.target.value);
                        }}
                        type="text"
                        placeholder={"Title"}
                      />
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setContentTable([...contentTable, { title: "Title", anchor: "Anchor" }]);
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
