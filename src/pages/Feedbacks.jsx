import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

function Feedbacks() {

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

  return (

    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        padding: "30px"
      }}
    >

      <h1>
        USER FEEDBACKS
      </h1>

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

export default Feedbacks;
