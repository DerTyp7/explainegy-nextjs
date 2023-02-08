import React from "react";
import Link from "next/link";
import styles from "@/styles/modules/AdminNav.module.scss";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

function AdminNav() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className={styles.adminNav}>
        <Link href={"/admin/editor/article/0"}>New article</Link>
        <Link href={"/admin/editor/category/0"}>New category</Link>
        <Link href={"/api/auth/signout"}>Logout</Link>
      </div>
    );
  }
}

export default AdminNav;
