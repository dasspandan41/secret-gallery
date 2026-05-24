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

    }, 2500);

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

  /* SPLASH SCREEN */

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

        <img
          src="https://i.ibb.co/6bQ7QYJ/logo.png"
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
          fontSize: "24px"
        }}
      >
        Invalid Login
      </div>

    );

  }

  return (

    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: "black",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative"
      }}
    >

      {/* PARTICLES */}

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

      {/* IMAGE */}

      <img
        src={
          gallery.images[currentIndex]
        }
        alt=""
        style={{
          position: "absolute",
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          transition:
            "all 0.8s ease",
          transform: "scale(1.05)"
        }}
      />

      {/* DARK OVERLAY */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "rgba(0,0,0,0.35)"
        }}
      />

      {/* PROFILE */}

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "15px",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "white"
        }}
      >

        {gallery.profilePhoto && (

          <img
            src={gallery.profilePhoto}
            alt=""
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              objectFit: "cover",
              border:
                "2px solid white"
            }}
          />

        )}

        <h2>
          {gallery.title ||
            "Your Secret Gallery"}
        </h2>

      </div>

      {/* HEART */}

      <button
        onClick={() =>
          setLiked(!liked)
        }
        style={{
          position: "absolute",
          top: "25px",
          right: "20px",
          zIndex: 30,
          background: "none",
          border: "none",
          fontSize: "35px",
          cursor: "pointer"
        }}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      {/* STORY BARS */}

      <div
        style={{
          position: "absolute",
          top: "95px",
          left: "10px",
          right: "10px",
          display: "flex",
          gap: "5px",
          zIndex: 20
        }}
      >

        {gallery.images.map((_, index) => (

          <div
            key={index}
            style={{
              flex: 1,
              height: "4px",
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
        style={navButtonLeft}
      >
        ←
      </button>

      {/* RIGHT BUTTON */}

      <button
        onClick={nextImage}
        style={navButtonRight}
      >
        →
      </button>

      {/* BOTTOM PANEL */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform:
            "translateX(-50%)",
          width: "92%",
          maxWidth: "420px",
          background:
            "rgba(255,255,255,0.08)",
          backdropFilter:
            "blur(14px)",
          padding: "18px",
          borderRadius: "22px",
          color: "white",
          zIndex: 20
        }}
      >

        <p>
          {gallery.message}
        </p>

        {gallery.music && (

          <audio
            controls
            autoPlay
            loop
            style={{
              width: "100%",
              marginTop: "12px"
            }}
          >
            <source
              src={gallery.music}
              type="audio/mp3"
            />
          </audio>

        )}

        <button
          onClick={() => {

            document
              .documentElement
              .requestFullscreen();

          }}
          style={actionButton}
        >
          Fullscreen Mode
        </button>

        <a
          href={
            gallery.images[currentIndex]
          }
          download
          target="_blank"
          rel="noreferrer"
        >

          <button
            style={actionButton}
          >
            Download Image
          </button>

        </a>

        <textarea
          placeholder="Leave your feedback..."
          value={feedback}
          onChange={(e) =>
            setFeedback(
              e.target.value
            )
          }
          style={{
            width: "100%",
            height: "85px",
            borderRadius: "14px",
            border: "none",
            outline: "none",
            padding: "12px",
            resize: "none",
            marginTop: "15px"
          }}
        />

        <button
          onClick={submitFeedback}
          style={{
            ...actionButton,
            background: "white",
            color: "black",
            fontWeight: "bold"
          }}
        >
          Submit Feedback
        </button>

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

const navButtonLeft = {

  position: "absolute",
  left: "12px",
  top: "50%",
  transform:
    "translateY(-50%)",
  zIndex: 30,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "none",
  background:
    "rgba(255,255,255,0.15)",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  backdropFilter:
    "blur(10px)"

};

const navButtonRight = {

  position: "absolute",
  right: "12px",
  top: "50%",
  transform:
    "translateY(-50%)",
  zIndex: 30,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "none",
  background:
    "rgba(255,255,255,0.15)",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  backdropFilter:
    "blur(10px)"

};

const actionButton = {

  marginTop: "12px",
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer"

};

export default Gallery;