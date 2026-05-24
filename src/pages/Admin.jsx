import { useState, useEffect } from "react";

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

  const [music, setMusic] =
    useState("");

  const [files, setFiles] =
    useState([]);

  const [feedbacks, setFeedbacks] =
    useState([]);

  useEffect(() => {

    fetchFeedbacks();

  }, []);

  const fetchFeedbacks = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "feedbacks")
      );

    let feedbackArray = [];

    querySnapshot.forEach((doc) => {

      feedbackArray.push(
        doc.data()
      );

    });

    setFeedbacks(
      feedbackArray
    );

  };

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
            message,
            music
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
            music,
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

      {/* UPLOAD SECTION */}

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
        type="text"
        placeholder="Paste Music URL"
        value={music}
        onChange={(e) =>
          setMusic(
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

      {/* FEEDBACK SECTION */}

      <h2
        style={{
          marginTop: "60px"
        }}
      >
        USER FEEDBACKS
      </h2>

      {feedbacks.length === 0 ? (

        <p>
          No feedback yet
        </p>

      ) : (

        feedbacks.map(
          (item, index) => (

            <div
              key={index}
              style={{
                background:
                  "#111",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "15px"
              }}
            >

              <h3>
                {item.username}
              </h3>

              <p>
                {item.feedback}
              </p>

            </div>

          )
        )

      )}

    </div>

  );

}

export default Admin;