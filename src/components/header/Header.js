import React from "react";
import { Button } from "@material-ui/core";
import modules from "./Header.module.css";
import { auth } from "../../firebase";
function Header({ setOpenSignInHandler, setOpenHandler, user }) {
  return (
    <div className={modules.header}>
      <img
        src="https://pngimg.com/uploads/instagram/instagram_PNG5.png"
        className={modules.header__logo}
      />
    </div>
  );
}

export default Header;
