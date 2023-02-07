import React from "react";
import { apiUrl } from "@/global";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";

export default function ArticleControl({ articleId }: { articleId: string }) {
  const router = useRouter();
  async function deleteArticle() {
    await fetch(urlJoin(apiUrl, `articles/${articleId}`), { method: "DELETE" })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
    router.push("/articles");
  }

  function editArticle() {
    router.push("/admin/editor/article/" + articleId);
  }

  return (
    <div>
      <button className="danger" onClick={deleteArticle}>
        Delete
      </button>
      <button className="warning" onClick={editArticle}>
        Edit
      </button>
    </div>
  );
}
