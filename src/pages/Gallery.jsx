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

      setCurrentIndex((prev) => {

        if (
          prev === gallery.images.length - 1
        ) {
          return 0;
        }

        return prev + 1;

      });

    }, 3000);

    return () => clearInterval(interval);

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
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? "100%"
                    : "0%",

                height: "100%",

                background: "white",

                transition:
                  index === currentIndex
                    ? "width 3s linear"
                    : "none"
              }}
            />

          </div>

        ))}

      </div>

      {/* IMAGE CLICK AREA */}

      <div
        onClick={(e) => {

          const screenWidth =
            window.innerWidth;

          const clickX =
            e.clientX;

          if (
            clickX > screenWidth / 2
          ) {

            setCurrentIndex((prev) =>

              prev ===
              gallery.images.length - 1

                ? 0

                : prev + 1

            );

          } else {

            setCurrentIndex((prev) =>

              prev === 0

                ? gallery.images.length - 1

                : prev - 1

            );

          }

        }}
      >

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

      </div>

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

        <audio controls>
          <source
            src="YOUR_MUSIC_LINK_HERE"
            type="audio/mp3"
          />
        </audio>

        <br />
        <br />

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