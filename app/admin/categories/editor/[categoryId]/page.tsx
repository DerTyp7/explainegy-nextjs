"use client";
import React, { useRef, useState } from "react";
import styles from "../../../../../styles/modules/CategoryEditor.module.scss";
import { Prisma } from "@prisma/client";
import "../../../../../styles/inputs.scss";
import "../../../../../styles/buttons.scss";
import { formatTextToUrlName } from "../../../../../utils";
import { isValidText } from "../../../../../validators";
import { CreateCategory, UpdateCategory } from "../../../../../types/api";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiUrl } from "../../../../../global";

type CategoryWithSvg = Prisma.CategoryGetPayload<{ include: { svg: true } }>;

export default function CategoryEditor({ params }: { params: { categoryId: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [svgViewbox, setSvgViewbox] = useState<string>("");
  const [svgPath, setSvgPath] = useState<string>("");

  const titleRef = useRef(null);
  const colorRef = useRef(null);
  const svgViewboxRef = useRef(null);
  const svgPathRef = useRef(null);
  const errorTextRef = useRef(null);
  function handleFormChange() {
    setTitle(titleRef.current.value);
    setColor(colorRef.current.value);
    setSvgPath(svgPathRef.current.value);
    setSvgViewbox(svgViewboxRef.current.value);
  }

  async function handleResponse(res: Response) {
    const json = await res.json();
    errorTextRef.current.innerText = json.error ?? "";
    if (json.success) {
      router.push(urlJoin(`/articles/`));
    }
  }

  async function updateCategory() {
    console.log("Update category");
    const payload: UpdateCategory = {
      id: params.categoryId,
      title: titleRef.current.value,
      color: colorRef.current.value,
      svg: {
        path: svgPathRef.current.value,
        viewbox: svgViewboxRef.current.value,
      },
    };
    console.log(payload);

    await fetch("/api/categories/", {
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

  async function createCategory() {
    console.log("Create category");
    const payload: CreateCategory = {
      title: titleRef.current.value,
      color: colorRef.current.value,
      svg: {
        path: svgPathRef.current.value,
        viewbox: svgViewboxRef.current.value,
      },
    };
    console.log(payload);

    await fetch("/api/categories/", {
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

  useEffect(() => {
    const fetchExistingCategory = async () => {
      const result: Response = await fetch(urlJoin(apiUrl, `categories/${params.categoryId}`), {
        cache: "no-cache",
      });

      const category = await result.json();
      console.log(category);
      if (category.code == "404") {
        router.push(urlJoin(`/admin/categories/editor/0`));
      } else {
        titleRef.current.value = category.title;
        colorRef.current.value = category.color;
        svgPathRef.current.value = category.svg.path;
        svgPathRef.current.value = category.svg.viewbox;

        setTitle(category.title);
        setColor(category.color);
        setSvgPath(category.svg.path);
        setSvgViewbox(category.svg.viewbox);
      }
    };

    if (params.categoryId != "0") {
      fetchExistingCategory().catch((err) => {
        console.log(err);
      });
    }
  }, []);

  return (
    <div className={styles.categoryEditor}>
      <h1>{params.categoryId == "0" ? "Create new category" : "Update category"}</h1>
      <div className={styles.formControl}>
        <p className="text-error" ref={errorTextRef}></p>
        <button
          type="button"
          onClick={() => {
            if (params.categoryId != "0") {
              updateCategory();
            } else {
              createCategory();
            }
          }}
        >
          {params.categoryId == "0" ? "Create category" : "Update category"}
        </button>
      </div>
      <div className={styles.form}>
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
          <div className={styles.svg}>
            <label>SVG</label>
            <div className={styles.svgInputs}>
              <input onChange={handleFormChange} type="text" placeholder="svg path" ref={svgPathRef} />
              <input onChange={handleFormChange} type="text" placeholder="0 0 512 512" ref={svgViewboxRef} />
            </div>
          </div>

          <div className={styles.color}>
            <label>Color</label>
            <input onChange={handleFormChange} type="color" ref={colorRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
