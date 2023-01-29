"use client";

import React from "react";

function AdminArticlesPage() {
  return (
    <div>
      <h1>Page to manage articles</h1>
      <a href="/admin/articles/editor/0">create new article</a> <br />
      <p>List of existing articles</p>
    </div>
  );
}

export default AdminArticlesPage;
