/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRef } from "react";
export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event) => {
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  };

  async function uploadImage() {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await fetch("/api/images/", {
        method: "POST",
        body: formData,
      });
      console.log(await response.json());
    }
  }

  return (
    <div>
      <input onChange={handleImageChange} ref={inputRef} type="file" name="image" accept="image/*" />
      {selectedImage && <img src={selectedImage} alt="Selected" />}
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
}
