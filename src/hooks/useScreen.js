import useAuth from "./useAuth";
import {useNavigate} from "react-router-dom"
import {useEffect} from "react"
import useApi from "./useApi";

const useScreen = (screen) => {
  const api = useApi()
  const [token] = useAuth()
  const navigate = useNavigate()
  useEffect (() => {
    if (token) {
      api.get("validate").then((res) => {
        if (screen && res.status === 200) {
          navigate(`/${screen}`)
        }
      }).catch(() => navigate("/"))
    } else {
      navigate("/")
    }
  }, [])
}

export default useScreen