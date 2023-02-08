import React from "react";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/modules/ArticleEditor.module.scss";
import { Prisma, Category } from "@prisma/client";
import Select from "react-select";
import { useRouter } from "next/navigation";
import urlJoin from "url-join";
import { IContentTableEntry } from "@/types/contentTable";
import { CreateArticle, UpdateArticle } from "@/types/api";
import { formatTextToUrlName } from "@/utils";
import { isValidText } from "@/validators";
import { apiUrl } from "@/global";
import Markdown from "@/components/Markdown";
import prisma, { ArticleWithIncludes, CategoryWithIncludes } from "@/lib/prisma";
import { CLIENT_RENEG_LIMIT } from "tls";
import { useSession } from "next-auth/react";

export default function AdminArticlesEditorPage({ article, categories }: { article: ArticleWithIncludes | null; categories: CategoryWithIncludes[] }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
  });

  const [title, setTitle] = useState<string>(article?.title ?? "");
  const [selectCategoriesOptions, setSelectCategoriesOptions] = useState<{ value: string; label: string }[]>(
    categories?.map((c: CategoryWithIncludes) => ({ value: c.id, label: c.title }))
  );

  const [introduction, setIntroduction] = useState<string>(article?.introduction ?? "");
  const [markdown, setMarkdown] = useState<string>(article?.markdown ?? "");
  const [contentTable, setContentTable] = useState<any>(article?.contentTable ?? []);

  const titleRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<any>(null);
  const introductionRef = useRef<HTMLInputElement>(null);
  const markdownTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const errorTextRef = useRef<HTMLParagraphElement>(null);

  function changeContentTableEntryAnchor(index: number, newAnchor: string) {
    setContentTable((prevArray: any) => {
      let newArray = [...prevArray];
      newArray[index].anchor = newAnchor;
      return newArray;
    });
  }

  function changeContentTableEntryTitle(index: number, newTitle: string) {
    setContentTable((prevArray: any) => {
      let newArray = [...prevArray];
      newArray[index].title = newTitle;
      return newArray;
    });
  }

  function removeEntry(index: number) {
    let newArray = [...contentTable];
    newArray.splice(index, 1);
    setContentTable(newArray);
  }

  // Create or update article
  async function handleResponse(res: Response) {
    const json = await res.json();
    if (errorTextRef?.current) {
      errorTextRef.current.innerText = json.error ?? "";
    }

    if (json.success) {
      const newArticle: ArticleWithIncludes = json.data;
      router.push(urlJoin(`/articles/`, newArticle.category.name, newArticle.name));
    }
  }

  async function updateArticle() {
    console.log("Update article");
    const payload: UpdateArticle = {
      title: titleRef?.current?.value,
      introduction: introductionRef?.current?.value,
      markdown: markdown,
      categoryId: categorySelectRef?.current?.getValue()[0]?.value,
      contentTable: contentTable,
    };
    console.log(payload);

    await fetch(`/api/articles/${article?.id.toString()}`, {
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
      title: titleRef?.current?.value ?? "",
      introduction: introductionRef?.current?.value ?? "",
      markdown: markdown,
      categoryId: categorySelectRef?.current?.getValue()[0]?.value,
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

  if (status === "authenticated") {
    return (
      <div className={styles.adminArticlesCreate}>
        <h1>{article ? "Update article" : "Create new article"}</h1>
        <div className={styles.formControl}>
          <p className="text-error" ref={errorTextRef}></p>
          <button
            type="button"
            onClick={() => {
              if (article) {
                updateArticle();
              } else {
                createArticle();
              }
            }}
          >
            {article ? "Update article" : "Create article"}
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.articleEditor}>
            <div className={styles.title}>
              <label htmlFor="title">Title</label>

              <div className={styles.titleInputs}>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                  }}
                  className={!isValidText(title) && title ? "error" : ""}
                  type="text"
                  name="title"
                  placeholder="title"
                  ref={titleRef}
                  defaultValue={title}
                />
                <input readOnly={true} className={""} type="text" name="name" value={title ? formatTextToUrlName(title) : ""} />
              </div>
            </div>
            <div className={styles.category}>
              <label htmlFor="title">Category</label>
              <Select
                ref={categorySelectRef}
                className="react-select-container"
                classNamePrefix="react-select"
                options={selectCategoriesOptions}
                defaultValue={article ? { value: article.category.id, label: article.category.title } : {}}
              />
            </div>
            <div className={styles.introduction}>
              <label htmlFor="title">Introduction</label>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIntroduction(e.target.value);
                }}
                className={!isValidText(introduction) && introduction ? "error" : ""}
                type="text"
                name="introduction"
                placeholder="Introduction"
                ref={introductionRef}
                defaultValue={introduction}
              />
            </div>
            <div className={styles.markdown}>
              <label htmlFor="">Markdown Editor</label>
              <div className={styles.markdownEditor}>
                <textarea
                  ref={markdownTextAreaRef}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setMarkdown(e.target.value);
                  }}
                  defaultValue={markdown}
                ></textarea>
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
  } else {
    return <></>;
  }
}

export async function getServerSideProps(context: any) {
  let article: ArticleWithIncludes | null = null;
  let categories: CategoryWithIncludes[] = [];

  const articleId: string = context.params.articleId.toString();

  if (articleId != "0") {
    await prisma.article.findUnique({ where: { id: articleId }, include: { category: true } }).then(
      (result: ArticleWithIncludes | null) => {
        if (result) {
          article = JSON.parse(JSON.stringify(result));
          console.log(article);
        } else {
          // TODO redirect to /0
        }
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  await prisma.category.findMany({ include: { svg: true, articles: true } }).then(
    (result: CategoryWithIncludes[]) => {
      if (result) {
        categories = JSON.parse(JSON.stringify(result));
      } else {
        // TODO redirect to /0
      }
    },
    (reason: any) => {
      console.log(reason);
    }
  );

  return {
    props: { article: article, categories: categories }, // will be passed to the page component as props
  };
}
