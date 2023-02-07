import React from "react";
import Link from "next/link";
import styles from "@/styles/modules/AdminNav.module.scss";

function AdminNav() {
  return (
    <div className={styles.adminNav}>
      <Link href={"/admin/editor/article/0"}>New article</Link>
      <Link href={"/admin/editor/category/0"}>New category</Link>
    </div>
  );
}

export default AdminNav;
