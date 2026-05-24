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
          flexDirection: "column"
        }}
      >

        <h1>
          Loading Gallery...
        </h1>

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

      {/* PROFILE HEADER */}

      <div
        style={{
          position: "absolute",
          top: "25px",
          left: "15px",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "white"
        }}
      >

        {gallery.profilePhoto && (

          <img
            src={gallery.profilePhoto}
            alt=""
            style={{
              width: "50px",
              height: "50px",
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

      {/* HEART BUTTON */}

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
          top: "90px",
          left: "10px",
          right: "10px",
          display: "flex",
          gap: "5px",
          zIndex: 10
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
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform:
            "translateY(-50%)",
          zIndex: 20,
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          border: "none",
          background:
            "rgba(0,0,0,0.5)",
          color: "white",
          fontSize: "22px",
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
          right: "10px",
          top: "50%",
          transform:
            "translateY(-50%)",
          zIndex: 20,
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          border: "none",
          background:
            "rgba(0,0,0,0.5)",
          color: "white",
          fontSize: "22px",
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
          objectFit: "cover",
          transition:
            "opacity 0.7s ease, transform 3s ease",
          transform: "scale(1.05)"
        }}
      />

      {/* MESSAGE BOX */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform:
            "translateX(-50%)",
          width: "90%",
          maxWidth: "400px",
          background:
            "rgba(0,0,0,0.55)",
          backdropFilter:
            "blur(10px)",
          padding: "15px",
          borderRadius: "20px",
          color: "white"
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
              marginTop: "10px"
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
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
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
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer"
            }}
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
            height: "80px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            padding: "10px",
            resize: "none",
            marginTop: "15px"
          }}
        />

        <button
          onClick={submitFeedback}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Submit Feedback
        </button>

      </div>

    </div>

  );

}

export default Gallery;