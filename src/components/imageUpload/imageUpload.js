/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "../../firebase";
import modules from "./imageUpload.module.css";
import firebase from "firebase";
function imageUpload({ userName }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              imageUrl: url,
              userName: userName,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };
  return (
    <div className={modules.imageUpload}>
      <progress
        className={modules.imageUpload__progress}
        max={100}
        value={progress}
      />
      <input
        type="text"
        className={modules.imageUpload__captionInput}
        placeholder="Enter a caption"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input
        type="file"
        onChange={handleChange}
        className={modules.imageUpload__fileInput}
      />
      <Button
        onClick={handleUpload}
        variant="outlined"
        color="primary"
        disableElevation
      >
        Upload
      </Button>
    </div>
  );
}

export default imageUpload;
