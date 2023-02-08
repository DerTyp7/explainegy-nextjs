import React from "react";
import { apiUrl } from "@/global";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isElementAccessExpression } from "typescript";

export default function ArticleControl({ articleId }: { articleId: string }) {
  const { data: session } = useSession();

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
  if (session) {
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
  } else {
    return <></>;
  }
}
