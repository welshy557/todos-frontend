import {useState} from "react"

function useAuth() {
  const [storedtoken, setToken] = useState(() => {
    try {
      const token = window.localStorage.getItem("token");
      return token ? token : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  const setStoredToken = (token) => {
    try {
      setToken(token);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", `bearer ${token}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedtoken, setStoredToken];

}

export default useAuth