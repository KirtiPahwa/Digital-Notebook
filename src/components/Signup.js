import React from "react";
import { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
export const Signup = (props) => {
  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [passwordStrength, setpasswordStrength] = useState("");
  const checkPassword = (s) => {
    let regExpWeak = /[a-z]/;
    let regExpMedium = /\d+/;
    let regExpStrong = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
    if (regExpStrong.test(s)) {
      setpasswordStrength("strong");
    } else if (regExpMedium.test(s)) {
      setpasswordStrength("medium");
    } else if (regExpWeak.test(s)) {
      setpasswordStrength("weak");
    } else {
      setpasswordStrength("");
    }
  };

  const navigate = useNavigate();
  const onchange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      checkPassword(e.target.value);
    }
  };
  const { name, email, password } = credentials;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      //if we write ({email,password}) then it means ({email:email,password:password}) but here i have to write credentials.email so have to mention properly email:credentials.email

      // Destructuring as like this:
      // const {email,password,cpassword}=credentials //destructuring
      // then use it in ({email,passowrd }) directly
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      //   we need to send success flag (from api) because we  need to check if user with same email already exist or not, then only we are signing here.So store the authtoken in localstorage and redirecting to the main page after success is true.
      props.showAlert("Account Created Successfully", "success");
    } else {
      props.showAlert(" Invalid Credential", "danger");
    }
  };
  return (
    <div>
      <div className="my-3">
        <h2>Create an account to use iNotebook</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Name</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="name"
            placeholder="Enter name"
            required
            onChange={onchange}
            value={credentials.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputName">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputName"
            aria-describedby="emailHelp"
            name="email"
            minLength={5}
            placeholder="Enter email"
            onChange={onchange}
            value={credentials.email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            required
            minLength={5}
            id="password"
            placeholder="Password"
            onChange={onchange}
            value={credentials.password}
          />
        </div>
        <div className="password_tip_container">
          <div
            className="weak_pass_container"
            style={{
              backgroundColor:
                passwordStrength === "strong"
                  ? "red"
                  : passwordStrength === "medium"
                  ? "red"
                  : passwordStrength === "weak"
                  ? "red"
                  : "rgb(171, 167, 167)",
            }}
          ></div>
          <div
            className="medium_pass_container"
            style={{
              backgroundColor:
                passwordStrength === "strong"
                  ? "orange"
                  : passwordStrength === "medium"
                  ? "orange"
                  : "rgb(171, 167, 167)",
            }}
          ></div>
          <div
            className="strong_pass_container"
            style={{
              backgroundColor:
                passwordStrength === "strong" ? "green" : "rgb(171, 167, 167)",
            }}
          ></div>
        </div>
        <div
          className="pass_intelligence"
          style={{
            color:
              passwordStrength === "strong"
                ? "green"
                : passwordStrength === "medium"
                ? "orange"
                : passwordStrength === "weak"
                ? "red"
                : "transparent",
          }}
        >
          {credentials.password.length > 0
            ? passwordStrength.charAt(0).toUpperCase() +
              passwordStrength.slice(1) +
              " password"
            : ""}
          <br />
          {credentials.password.length < 8
            ? "Password should be more than 8 characters "
            : ""}
        </div>
        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="cpassword"
            id="cpassword"
            minLength={5}
            required
            placeholder="Password"
            onChange={onchange}
            value={credentials.cpassword}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
