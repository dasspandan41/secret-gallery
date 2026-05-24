import {
  useEffect,
  useState,
  useRef
} from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

function Gallery() {

  const [gallery, setGallery] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [liked, setLiked] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [feedback, setFeedback] =
    useState("");

  const touchStartX = useRef(0);

  const touchEndX = useRef(0);

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

    setTimeout(() => {

      setLoading(false);

    }, 1500);

  };

  const submitFeedback =
    async () => {

      if (!feedback) return;

      await addDoc(
        collection(db, "feedbacks"),
        {
          username,
          feedback
        }
      );

      alert(
        "Feedback Submitted"
      );

      setFeedback("");

    };

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

  const handleTouchStart = (e) => {

    touchStartX.current =
      e.changedTouches[0].screenX;

  };

  const handleTouchEnd = (e) => {

    touchEndX.current =
      e.changedTouches[0].screenX;

    if (
      touchStartX.current -
        touchEndX.current >
      50
    ) {

      nextImage();

    }

    if (
      touchEndX.current -
        touchStartX.current >
      50
    ) {

      prevImage();

    }

  };

 if (loading) {

  return (

    <div
      style={{
        background: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >

      {/* LOGO */}

      <img
        src="YOUR_LOGO_LINK"
        alt=""
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "30px",
          marginBottom: "25px",
          animation:
            "pulse 2s infinite"
        }}
      />

      {/* APP NAME */}

      <h1
        style={{
          fontSize: "38px",
          letterSpacing: "3px",
          marginBottom: "15px"
        }}
      >
        SECRET GALLERY
      </h1>

      <p
        style={{
          opacity: 0.7
        }}
      >
        Loading your memories...
      </p>

      {/* LOADING BAR */}

      <div
        style={{
          width: "220px",
          height: "5px",
          background:
            "rgba(255,255,255,0.2)",
          borderRadius: "20px",
          marginTop: "25px",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            width: "100%",
            height: "100%",
            background: "white",
            animation:
              "loading 1.5s linear infinite"
          }}
        />

      </div>

      <style>
        {`

          @keyframes pulse {

            0% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.08);
            }

            100% {
              transform: scale(1);
            }

          }

          @keyframes loading {

            0% {
              transform:
                translateX(-100%);
            }

            100% {
              transform:
                translateX(100%);
            }

          }

        `}
      </style>

    </div>

  );

}