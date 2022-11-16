import React from "react";
import Notes from "./Notes";

export default function Home(props) {
  return (
    <div
    // style={{ backgroundColor: "black" }}
    >
      <Notes showAlert={props.showAlert} />
    </div>
  );
}
