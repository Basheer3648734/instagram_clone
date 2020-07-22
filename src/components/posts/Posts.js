import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import modules from "./Posts.module.css";
import { db } from "../../firebase";
import firebase from "firebase";
function Posts({ userName, caption, imageUrl, user, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      userName: user.displayName,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className={modules.posts}>
      {/* header -> avatar + username */}
      <div className={modules.posts__header}>
        <Avatar
          alt={userName}
          className={modules.header__avatar}
          src="../../../public/logo512.png"
        />
        <h3 className={modules.header__username}>{userName}</h3>
      </div>
      {/* image */}
      <img src={imageUrl} className={modules.posts__image} />
      {/* caption */}
      <p className={modules.posts__caption}>
        <strong>{userName} </strong>
        {caption}
      </p>
      {/* comments */}
      <div className={modules.posts__comments}>
        {comments.map((comment) => (
          <p>
            <b>{comment.userName}</b> {comment.text}
          </p>
        ))}
      </div>
      {/* Add comment box */}
      {user && (
        <form className={modules.posts__commentBox}>
          <input
            type="text"
            placeholder="Add comments..."
            className={modules.posts__input}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className={modules.posts__button}
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Posts;
