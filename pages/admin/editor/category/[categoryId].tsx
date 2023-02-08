import React, { useRef, useState } from "react";
import styles from "@/styles/modules/CategoryEditor.module.scss";
import { Prisma, Category } from "@prisma/client";
import { formatTextToUrlName } from "@/utils";
import { isValidText } from "@/validators";
import { CreateCategory, UpdateCategory } from "@/types/api";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiUrl } from "@/global";
import prisma, { CategoryWithIncludes } from "@/lib/prisma";
import { useSession } from "next-auth/react";

export default function AdminCategoriesEditor({ category }: { category: CategoryWithIncludes | null }) {
  const { status } = useSession({
    required: true,
  });

  const router = useRouter();
  const [title, setTitle] = useState<string>(category?.title ?? "");
  const [color, setColor] = useState<string>(category?.color ?? "");
  const [svgViewbox, setSvgViewbox] = useState<string>(category?.svg?.viewbox ?? "");
  const [svgPath, setSvgPath] = useState<string>(category?.svg?.path ?? "");

  const titleRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const svgViewboxRef = useRef<HTMLInputElement>(null);
  const svgPathRef = useRef<HTMLInputElement>(null);
  const errorTextRef = useRef<HTMLParagraphElement>(null);

  async function handleResponse(res: Response) {
    const json = await res.json();

    if (errorTextRef?.current) {
      errorTextRef.current.innerText = json.error ?? "";
    }

    if (json.success) {
      router.push(urlJoin(`/articles/`));
    }
  }

  async function updateCategory() {
    console.log("Update category");
    const payload: UpdateCategory = {
      title: titleRef?.current?.value,
      color: colorRef?.current?.value,
      svg: {
        path: svgPathRef?.current?.value,
        viewbox: svgViewboxRef?.current?.value,
      },
    };
    console.log(payload);

    await fetch(`/api/categories/${category?.id.toString()}`, {
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
      title: titleRef?.current?.value ?? "",
      color: colorRef?.current?.value ?? "",
      svg: {
        path: svgPathRef?.current?.value ?? "",
        viewbox: svgViewboxRef?.current?.value ?? "",
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

  if (status === "authenticated") {
    return (
      <div className={styles.categoryEditor}>
        <h1>{category ? "Update category" : "Create new category"}</h1>
        <div className={styles.formControl}>
          <p className="text-error" ref={errorTextRef}></p>
          <button
            type="button"
            onClick={() => {
              if (category) {
                updateCategory();
              } else {
                createCategory();
              }
            }}
          >
            {category ? "Update category" : "Create category"}
          </button>
        </div>
        <div className={styles.form}>
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
            <div className={styles.svg}>
              <label>SVG</label>
              <div className={styles.svgInputs}>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSvgPath(e.target.value);
                  }}
                  type="text"
                  placeholder="svg path"
                  ref={svgPathRef}
                  defaultValue={svgPath}
                />
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSvgViewbox(e.target.value);
                  }}
                  type="text"
                  placeholder="0 0 512 512"
                  ref={svgViewboxRef}
                  defaultValue={svgViewbox}
                />
              </div>
            </div>

            <div className={styles.color}>
              <label>Color</label>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setColor(e.target.value);
                }}
                type="color"
                ref={colorRef}
                defaultValue={color}
              />
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
  let category: CategoryWithIncludes | null = null;
  const categoryId: string = context.params.categoryId.toString();

  if (categoryId != "0") {
    await prisma.category.findUnique({ where: { id: categoryId }, include: { articles: true, svg: true } }).then(
      (result: CategoryWithIncludes | null) => {
        if (result) {
          category = JSON.parse(JSON.stringify(result));
        } else {
          // TODO redirect to /0
        }
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  return {
    props: { category: category }, // will be passed to the page component as props
  };
}
