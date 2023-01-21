"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import styles from "../../../../styles/modules/AdminArticlesCreate.module.scss";
import { PostArticle } from "../../../../types/postData";
import Markdown from "../../../Markdown";
import { Category } from "@prisma/client";
import "../../../../styles/inputs.scss";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { apiUrl } from "../../../global";
import urlJoin from "url-join";
import { getUrlSafeString } from "../../../utils";

export default function AdminArticlesCreate() {
  const [formData, setFormData] = useState<PostArticle>(null);
  const [title, setTitle] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [selectCategoriesOptions, setSelectCategoriesOptions] = useState<any>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef(null);
  const introductionRef = useRef<HTMLInputElement>(null);
  const markdownTextAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleFormChange() {
    setMarkdown(markdownTextAreaRef.current.value);
    setTitle(titleRef.current.value);
    setFormData({
      name: getUrlSafeString(titleRef.current.value),
      title: titleRef.current.value,
      introduction: introductionRef.current.value,
      markdown: markdown,
      categoryId: Number(categorySelectRef?.current?.getValue()[0]?.value),
    });
  }

  async function postData() {
    console.log(formData);
    await fetch("/api/articles/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      const result: Response = await fetch(urlJoin(apiUrl, `categories`), {
        cache: "no-cache",
        next: { revalidate: 60 * 1 },
      });
      console.log();

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
      <button
        type="button"
        onClick={() => {
          postData();
        }}
      >
        send
      </button>
      <div className={styles.form}>
        <div className={styles.contentTableEditor}>contenttable</div>

        <div className={styles.articleEditor}>
          <div className={styles.title}>
            <label htmlFor="title">Title</label>

            <div className={styles.titleInputs}>
              <input
                onChange={handleFormChange}
                className={""}
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
                value={getUrlSafeString(title)}
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
            {" "}
            <label htmlFor="title">Introduction</label>
            <input
              onChange={handleFormChange}
              className={""}
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
        </div>
      </div>
    </div>
  );
}
