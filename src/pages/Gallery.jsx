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

  const [showPanel, setShowPanel] =
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

    }, 2000);

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

        <img
          src="https://kommodo.ai/i/vv32T6IXgCQWby0jpwXG"
          alt=""
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "25px",
            marginBottom: "20px",
            animation:
              "pulse 2s infinite"
          }}
        />

        <h1
          style={{
            fontSize: "42px",
            letterSpacing: "3px"
          }}
        >
          SECRET GALLERY
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "10px"
          }}
        >
          Loading Memories...
        </p>

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
          height: "100vh",
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
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "black"
      }}
    >

      {/* IMAGE */}

      <img
        src={
          gallery.images[currentIndex]
        }
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition:
            "all 0.7s ease"
        }}
      />

      {/* OVERLAY */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "rgba(0,0,0,0.25)"
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
            "Secret Gallery"}
        </h2>

      </div>

      {/* HEART */}

      <button
        onClick={() =>
          setLiked(!liked)
        }
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 20,
          background: "none",
          border: "none",
          fontSize: "34px",
          cursor: "pointer"
        }}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      {/* STORY BAR */}

      <div
        style={{
          position: "absolute",
          top: "90px",
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

      {/* MESSAGE PANEL */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform:
            "translateX(-50%)",
          width: "92%",
          maxWidth: "400px",
          zIndex: 30
        }}
      >

        <div
          style={{
            background:
              "rgba(0,0,0,0.45)",
            backdropFilter:
              "blur(12px)",
            borderRadius: "20px",
            padding: "16px",
            color: "white"
          }}
        >

          <p
            style={{
              lineHeight: "24px"
            }}
          >
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
            onClick={() =>
              setShowPanel(!showPanel)
            }
            style={smallButton}
          >
            {showPanel
              ? "Close Options"
              : "More Options"}
          </button>

          {showPanel && (

            <div>

              <button
                onClick={() => {

                  document
                    .documentElement
                    .requestFullscreen();

                }}
                style={smallButton}
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
                  style={smallButton}
                >
                  Download Image
                </button>

              </a>

              <textarea
                placeholder="Leave feedback..."
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
                  marginTop: "12px"
                }}
              />

              <button
                onClick={submitFeedback}
                style={{
                  ...smallButton,
                  background: "white",
                  color: "black",
                  fontWeight: "bold"
                }}
              >
                Submit Feedback
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

const navButtonLeft = {

  position: "absolute",
  left: "15px",
  top: "50%",
  transform:
    "translateY(-50%)",
  zIndex: 20,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "none",
  background:
    "rgba(255,255,255,0.2)",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  backdropFilter:
    "blur(10px)"

};

const navButtonRight = {

  position: "absolute",
  right: "15px",
  top: "50%",
  transform:
    "translateY(-50%)",
  zIndex: 20,
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "none",
  background:
    "rgba(255,255,255,0.2)",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  backdropFilter:
    "blur(10px)"

};

const smallButton = {

  marginTop: "10px",
  width: "100%",
  padding: "11px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background:
    "rgba(255,255,255,0.18)",
  color: "white",
  fontWeight: "bold"

};

export default Gallery;