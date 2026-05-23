import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

function Gallery() {

  const [gallery, setGallery] = useState(null);

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

      <div
        style={{
          display: "flex",
          gap: "5px",
          padding: "15px"
        }}
      >

        {gallery.images.map((_, index) => (

          <div
            key={index}
            style={{
              flex: 1,
              height: "5px",
              background:
                index <= currentIndex
                  ? "white"
                  : "gray",
              borderRadius: "10px"
            }}
          />

        ))}

      </div>

      <img
        src={gallery.images[currentIndex]}
        alt=""
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "contain"
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "20px",
          background:
            "rgba(0,0,0,0.6)",
          padding: "15px",
          borderRadius: "15px"
        }}
      >

        <h2>Your Secret Gallery</h2>

        <p>{gallery.message}</p>

      </div>

    </div>
  );
}

export default Gallery;
<audio controls>
  <source src={musicUrl} type="audio/mp3" />
</audio>
<textarea placeholder="Leave your feedback..." />