import React from "react";
import PropTypes from "prop-types";
import "./minireset.css"
import "./App.css";

function App({ avatar, title }) {
  const avatarStyles = {
    backgroundImage: `url('${avatar}')`,
  };

  return (
    <div className="App">
      <div className="photo" style={avatarStyles}></div>
      <div className="code" />
    </div>
  );
}

App.propTypes = {
  avatar: PropTypes.string,
};
App.defaultProps = {
  avatar:
    "https://www.placecage.com/c/460/300",
};

export default App;
