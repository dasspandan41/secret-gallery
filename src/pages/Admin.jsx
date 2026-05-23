import { useState } from "react";

import axios from "axios";

import {
  CLOUD_NAME,
  UPLOAD_PRESET
} from "../cloudinary";

import { db } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";

function Admin() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [files, setFiles] =
    useState([]);

  const uploadGallery = async () => {

    try {

      if (!username || !password) {

        alert(
          "Enter username and password"
        );

        return;

      }

      let uploadedImages = [];

      for (
        let i = 0;
        i < files.length;
        i++
      ) {

        const formData =
          new FormData();

        formData.append(
          "file",
          files[i]
        );

        formData.append(
          "upload_preset",
          UPLOAD_PRESET
        );

        const response =
          await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
          );

        uploadedImages.push(
          response.data.secure_url
        );

      }

      const galleryRef =
        collection(
          db,
          "galleries"
        );

      const q = query(
        galleryRef,
        where(
          "username",
          "==",
          username
        ),
        where(
          "password",
          "==",
          password
        )
      );

      const existingGallery =
        await getDocs(q);

      if (
        !existingGallery.empty
      ) {

        const galleryDoc =
          existingGallery.docs[0];

        const oldImages =
          galleryDoc.data()
            .images || [];

        const updatedImages = [
          ...oldImages,
          ...uploadedImages
        ];

        await updateDoc(
          doc(
            db,
            "galleries",
            galleryDoc.id
          ),
          {
            images:
              updatedImages,
            message
          }
        );

      } else {

        await addDoc(
          collection(
            db,
            "galleries"
          ),
          {
            username,
            password,
            message,
            images:
              uploadedImages
          }
        );

      }

      alert(
        "Gallery Uploaded Successfully"
      );

    } catch (error) {

      console.log(error);

      alert("Upload Failed");

    }

  };

  return (

    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        padding: "40px"
      }}
    >

      <h1>
        ADMIN PANEL
      </h1>

      <input
        type="text"
        placeholder="Assign Username"
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
          )
        }
        style={{
          padding: "10px",
          marginTop: "20px",
          display: "block",
          width: "300px"
        }}
      />

      <input
        type="password"
        placeholder="Assign Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        style={{
          padding: "10px",
          marginTop: "20px",
          display: "block",
          width: "300px"
        }}
      />

      <textarea
        placeholder="Custom Message"
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        style={{
          padding: "10px",
          marginTop: "20px",
          display: "block",
          width: "300px",
          height: "120px"
        }}
      />

      <input
        type="file"
        multiple
        onChange={(e) =>
          setFiles(
            e.target.files
          )
        }
        style={{
          marginTop: "20px",
          display: "block"
        }}
      />

      <button
        onClick={
          uploadGallery
        }
        style={{
          marginTop: "20px",
          padding:
            "12px 20px",
          cursor: "pointer"
        }}
      >
        Upload Gallery
      </button>

    </div>

  );

}

export default Admin;