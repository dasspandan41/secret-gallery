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

  const [title, setTitle] =
    useState("");

  const [profilePhoto, setProfilePhoto] =
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
            title,
            profilePhoto,
            message,
            music,
            images:
              updatedImages
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
            title,
            profilePhoto,
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
        background:
          "linear-gradient(to bottom, #000, #111)",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* FLOATING PARTICLES */}

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
          zIndex: 0
        }}
      >

        {[...Array(40)].map((_, i) => (

          <div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              background: "white",
              borderRadius: "50%",
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${
                5 + Math.random() * 10
              }s linear infinite`
            }}
          />

        ))}

      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          position: "relative",
          zIndex: 10
        }}
      >

        <h1
          style={{
            marginBottom: "30px",
            fontSize: "42px"
          }}
        >
          ADMIN PANEL
        </h1>

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "20px",
            backdropFilter:
              "blur(10px)",
            maxWidth: "400px"
          }}
        >

          <input
            type="text"
            placeholder="Assign Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            style={inputStyle}
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
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Gallery Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Profile Photo URL"
            value={profilePhoto}
            onChange={(e) =>
              setProfilePhoto(
                e.target.value
              )
            }
            style={inputStyle}
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
              ...inputStyle,
              height: "120px",
              resize: "none"
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
            style={inputStyle}
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
              marginTop: "20px"
            }}
          />

          <button
            onClick={
              uploadGallery
            }
            style={{
              marginTop: "25px",
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              background:
                "white",
              color: "black"
            }}
          >
            Upload Gallery
          </button>

        </div>

        {/* FEEDBACK SECTION */}

        <h2
          style={{
            marginTop: "70px",
            fontSize: "34px"
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
                    "rgba(255,255,255,0.08)",
                  padding: "20px",
                  marginTop: "20px",
                  borderRadius: "18px",
                  maxWidth: "500px",
                  backdropFilter:
                    "blur(10px)"
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

      <style>
        {`

          @keyframes float {

            0% {

              transform:
                translateY(0px);

            }

            100% {

              transform:
                translateY(-100vh);

            }

          }

        `}
      </style>

    </div>

  );

}

const inputStyle = {

  padding: "12px",
  marginTop: "15px",
  display: "block",
  width: "100%",
  borderRadius: "12px",
  border: "none",
  background:
    "rgba(255,255,255,0.12)",
  color: "white",
  outline: "none"

};

export default Admin;