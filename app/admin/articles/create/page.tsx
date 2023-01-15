"use client";

import React from "react";

import { useState, useRef } from "react";
import styles from "../../../../styles/modules/AdminArticlesCreate.module.scss";
import { PostArticle } from "../../../../types/postData";
import Markdown from "../../../Markdown";
import { Category } from "@prisma/client";
import "../../../../styles/inputs.scss";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { apiUrl } from "../../../global";
import urlJoin from "url-join";

export default function AdminArticlesCreate() {
  const [formData, setFormData] = useState<PostArticle>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const selectCategoriesOptions: any = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  function handleFormChange() {
    setMarkdown(markdownTextAreaRef.current.value);
    setFormData({
      name: titleRef.current.value.replaceAll(" ", "%20"),
      title: titleRef.current.value,
      introduction: "test intro",
      markdown: markdown,
      categoryId: 2,
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
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            value={selectedCategory}
            onChange={handleFormChange}
            options={selectCategoriesOptions}
          />
          <input
            onChange={handleFormChange}
            className={""}
            type="text"
            name="title"
            placeholder="title"
            ref={titleRef}
          />

          <div className={styles.markdown}>
            <textarea ref={markdownTextAreaRef} onChange={handleFormChange}></textarea>
            <Markdown value={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
