import React from "react";
import Link from "next/link";
import styles from "../styles/modules/AdminNav.module.scss";

function AdminNav() {
  return (
    <div className={styles.adminNav}>
      <Link href={"/admin"}>Admin</Link>
      <Link href={"/admin/articles/editor/0"}>New article</Link>
      <Link href={"/admin/categories/editor/0"}>New category</Link>
    </div>
  );
}

export default AdminNav;
