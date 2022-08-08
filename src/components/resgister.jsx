import { useState } from "react";
import "../index.css";
import useApi from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./loader";
import { useMutation, useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const api = useApi();
  const navigate = useNavigate();

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    confirmPassword.length > 0 ? password === confirmPassword : true;
  const passwordHasUpper = [...password].some((char) => /^[A-Z]*$/.test(char));
  const passwordHasDigit = [...password].some((char) => /^[0-9]*$/.test(char));

  const validPassword =
    passwordHasUpper && passwordHasDigit && password.length >= 8;

  const errors = [];
  const { mutateAsync: handleSubmit, isLoading } = useMutation(
    async (e) => {
      e.preventDefault();
      if (!validPassword) {
        errors.push("Invalid Password");
      }

      if (userExists) {
        errors.push("User Already Exist");
      }

      if (errors.length > 0) {
        throw new Error("User Errors Occured");
      }
      const data = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        email: e.target.email.value,
        password: e.target.password.value,
      };

      const result = await api.post("users", data);
      return result;
    },
    {
      onSuccess: () => {
        navigate("/", { state: { msg: "Succesfully Created User" } });
      },
      onError: (err) => {
        errors.forEach((userErr) => toast.error(userErr));
        console.error(err);
      },
    }
  );

  const { data: users, isLoading: isLoadingUsers } = useQuery(
    ["users"],
    async () => {
      const result = await api.get("users");
      return await result;
    },
    {
      onError: (err) => console.log(err),
    }
  );

  const userExists =
    email.length > 0 ? users?.data.some((user) => user.email === email) : false;

  return (
    <>
      <Toaster />
      <Loader isLoading={isLoading || isLoadingUsers} />
      <div className="mainContainer">
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="title">Register</div>
            <label className="label" htmlFor="firstName">
              First Name
            </label>
            <input
              className="emailInput"
              type="text"
              name="firstName"
              required
            />
            <label className="label" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="emailInput"
              type="text"
              name="lastName"
              required
            />
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="emailInput"
              type="email"
              name="email"
              title="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            {userExists && (
              <div
                style={{
                  marginLeft: 50,
                  marginBottom: 5,
                  marginTop: 2,
                  color: "white",
                }}
              >
                Email already registered.{" "}
                <Link style={{ color: "white" }} to={{ pathname: "/" }}>
                  Sign In
                </Link>
              </div>
            )}
            <label className="label" htmlFor="password">
              Password
            </label>
            <div>
              <input
                className="passwordInput"
                type="password"
                name="password"
                value={password}
                required
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <FontAwesomeIcon
                  icon={validPassword ? faCircleCheck : faCircleXmark}
                  color={validPassword ? "green" : "red"}
                  style={{ paddingRight: 50, paddingLeft: 10 }}
                />
              )}
            </div>
            {passwordFocused && (
              <div className="passwordRulesContainer">
                <div
                  className="passwordRule"
                  style={{ color: password.length > 8 ? "green" : "red" }}
                >
                  8 Characters Long
                </div>
                <div
                  className="passwordRule"
                  style={{ color: passwordHasDigit ? "green" : "red" }}
                >
                  Contains 1 Digit
                </div>
                <div
                  className="passwordRule"
                  style={{ color: passwordHasUpper ? "green" : "red" }}
                >
                  Contains 1 Capital Letter
                </div>
              </div>
            )}
            <label className="label" htmlFor="password">
              Confirm Password
            </label>
            <div className="passwordInputContainer">
              <input
                className="passwordInput"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password.length > 0 && (
                <FontAwesomeIcon
                  icon={passwordsMatch ? faCircleCheck : faCircleXmark}
                  color={passwordsMatch ? "green" : "red"}
                  style={{ paddingRight: 50, paddingLeft: 10 }}
                />
              )}
            </div>
            {!passwordsMatch && (
              <div style={{ marginLeft: 50, marginBottom: 5, color: "white" }}>
                Passwords must match
              </div>
            )}
            <button className="loginButton" type="submit">
              Sign Up
            </button>
          </div>
          <div style={{ marginLeft: 10 }}>
            Already Registered?{" "}
            <Link style={{ color: "white" }} to={{ pathname: "/" }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
