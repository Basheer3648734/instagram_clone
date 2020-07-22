import React, { useState, useEffect } from "react";
import "./App.css";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Posts from "./components/posts/Posts";
import { db, auth } from "./firebase";
import Header from "./components/header/Header";
import ImageUpload from "./components/imageUpload/imageUpload";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    padding: "10px 15px",
  },
}));

const App = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
  //useEffect
  useEffect(() => {
    //this is where the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form__signup">
            <center>
              <img
                src="https://pngimg.com/uploads/instagram/instagram_PNG5.png"
                alt="instagram logo"
                className="modal__logo"
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>
      {/* sign in modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form__signup">
            <center>
              <img
                src="https://pngimg.com/uploads/instagram/instagram_PNG5.png"
                alt="instagram logo"
                className="modal__logo"
              />
            </center>

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="header">
        <img
          src="https://pngimg.com/uploads/instagram/instagram_PNG5.png"
          className="header__logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>
      {/* add post form */}
      {user?.displayName ? (
        <ImageUpload userName={user.displayName} />
      ) : (
        <center>
          <h3>Sorry you need to login to upload</h3>
        </center>
      )}
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Posts
            key={id}
            postId={id}
            user={user}
            userName={post.userName}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
export default App;
