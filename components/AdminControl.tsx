import React from "react";
import styles from "../styles/modules/AdminControl.module.scss";

export default function AdminControl() {
  return (
    <div className={styles.adminControl}>
      <button className="danger">Delete this article</button>
      <button className="warning">Edit this article</button>
    </div>
  );
}
