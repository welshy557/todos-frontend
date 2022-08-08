import "../index.css";
import useAuth from "../hooks/useAuth";
import useScreen from "../hooks/useScreen";
import useApi from "../hooks/useApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "./loader";
import { useMutation } from "react-query";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  useScreen("home");
  const navigate = useNavigate();
  const location = useLocation();
  const [, setStoredToken] = useAuth();
  const api = useApi();

  if (location.state?.msg) {
    toast.success(location.state.msg);
    location.state.msg = undefined;
  }

  const { mutateAsync: handleLogin, isLoading } = useMutation(
    async (e) => {
      e.preventDefault();
      const data = {
        email: e.target.email.value,
        password: e.target.password.value,
      };
      return await api.post("login", data);
    },
    {
      onSuccess: (res) => {
        setStoredToken(res.data.token);
        navigate("/home");
      },
      onError: (err) => {
        console.error(err);
        if (err.message === "Request failed with status code 401") {
          toast.error("Incorrect username/password");
        }
      },
    }
  );
  return (
    <>
      <Toaster />
      <Loader isLoading={isLoading} />
      <div className="mainContainer">
        <form onSubmit={handleLogin}>
          <div className="container">
            <div className="title">Sign In</div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="emailInput"
              type="email"
              name="email"
              title="Email"
            />
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="passwordInput"
              type="password"
              name="password"
              title="Password"
            />
            <button className="loginButton" type="submit">
              Log In{" "}
            </button>
          </div>
          <div style={{ marginLeft: 10 }}>
            Not Registered?{" "}
            <Link style={{ color: "white" }} to={{ pathname: "/register" }}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
