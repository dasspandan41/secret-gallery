import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

function Gallery() {

  const [gallery, setGallery] =
    useState(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const username =
    localStorage.getItem("username");

  const password =
    localStorage.getItem("password");

  useEffect(() => {

    fetchGallery();

  }, []);

  useEffect(() => {

    if (!gallery) return;

    const interval = setInterval(() => {

      setCurrentIndex((prev) =>

        prev ===
        gallery.images.length - 1

          ? 0

          : prev + 1

      );

    }, 3000);

    return () =>
      clearInterval(interval);

  }, [gallery]);

  const fetchGallery = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "galleries")
      );

    querySnapshot.forEach((doc) => {

      const data = doc.data();

      if (
        data.username === username &&
        data.password === password
      ) {

        setGallery(data);

      }

    });

  };

  if (!gallery) {

    return (

      <div
        style={{
          background: "black",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px"
        }}
      >
        Invalid Login
      </div>

    );

  }

  const nextImage = () => {

    setCurrentIndex((prev) =>

      prev ===
      gallery.images.length - 1

        ? 0

        : prev + 1

    );

  };

  const prevImage = () => {

    setCurrentIndex((prev) =>

      prev === 0

        ? gallery.images.length - 1

        : prev - 1

    );

  };

  return (

    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        overflow: "hidden",
        position: "relative"
      }}
    >

      {/* STORY BARS */}

      <div
        style={{
          display: "flex",
          gap: "5px",
          padding: "15px",
          position: "absolute",
          top: "0",
          width: "100%",
          zIndex: 10
        }}
      >

        {gallery.images.map((_, index) => (

          <div
            key={index}
            style={{
              flex: 1,
              height: "5px",
              background:
                "rgba(255,255,255,0.3)",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width:
                  index <= currentIndex
                    ? "100%"
                    : "0%",

                height: "100%",

                background: "white",

                transition:
                  "width 3s linear"
              }}
            />

          </div>

        ))}

      </div>

      {/* LEFT BUTTON */}

      <button
        onClick={prevImage}
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform:
            "translateY(-50%)",
          zIndex: 20,
          fontSize: "30px",
          background:
            "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: "pointer"
        }}
      >
        ←
      </button>

      {/* RIGHT BUTTON */}

      <button
        onClick={nextImage}
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform:
            "translateY(-50%)",
          zIndex: 20,
          fontSize: "30px",
          background:
            "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: "pointer"
        }}
      >
        →
      </button>

      {/* IMAGE */}

      <img
        src={
          gallery.images[currentIndex]
        }
        alt=""
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "contain"
        }}
      />

      {/* MESSAGE BOX */}

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "20px",
          background:
            "rgba(0,0,0,0.6)",
          padding: "15px",
          borderRadius: "15px",
          backdropFilter:
            "blur(10px)"
        }}
      >

        <h2>
          Your Secret Gallery
        </h2>

        <p>
          {gallery.message}
        </p>

        <textarea
          placeholder="Leave your feedback..."
          style={{
            width: "250px",
            height: "80px",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            outline: "none"
          }}
        />

      </div>

    </div>

  );

}

export default Gallery;