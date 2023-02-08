import React from "react";
import { apiUrl } from "@/global";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CategoryControl({ categoryId }: { categoryId: string }) {
  const { data: session } = useSession();

  const router = useRouter();
  async function deleteCategory() {
    await fetch(urlJoin(apiUrl, `categories/${categoryId}`), { method: "DELETE" })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
    router.push("/articles");
  }

  function editCategory() {
    router.push("/admin/editor/category/" + categoryId);
  }

  if (session) {
    return (
      <div>
        <button className="danger" onClick={deleteCategory}>
          Delete
        </button>
        <button className="warning" onClick={editCategory}>
          Edit
        </button>
      </div>
    );
  } else {
    return <></>;
  }
}
