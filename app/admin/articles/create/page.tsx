"use client";

import React from "react";

import { useState, useRef } from "react";
import styles from "../../../../styles/modules/AdminArticlesCreate.module.scss";
import { PostArticle } from "../../../../types/postData";
import Markdown from "../../../Markdown";

export default function AdminArticlesCreate() {
  const [formData, setFormData] = useState<PostArticle>(null);
  const [markdown, setMarkdown] = useState<string>("");

  const titleRef = useRef<HTMLInputElement>(null);

  function handleFormChange({ newMarkdownText = markdown }) {
    setFormData({
      name: titleRef.current.value.replaceAll(" ", "%20"),
      title: titleRef.current.value,
      introduction: "test intro",
      markdown: markdown,
      categoryId: 1,
    });

    setMarkdown(newMarkdownText);
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
        <div className={styles.ContentTable}>contenttable</div>

        <div className={styles.content}>
          <input
            onChange={() => {
              handleFormChange({});
            }}
            type="text"
            name="title"
            placeholder="title"
            ref={titleRef}
          />
          <textarea></textarea>
          <Markdown value={markdown} />
        </div>
      </div>
    </div>
  );
}
