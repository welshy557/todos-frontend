import useAuth from "./useAuth"
import axios from "axios"

const useApi = () => {
  const [token] = useAuth()
  
  const postOrPut = async (method, endpoint, data) => {
    const options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': token
      },
      url: `https://todoical.herokuapp.com/${endpoint}`,
      json: true,
      data: data
    }
    try {
      const response = await axios(options)
      return response
    } catch (err) {
      throw new Error(err.message)
    }
  }
  
  const getOrDelete = async (method, endpoint) => {
    const options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': token
      },
      url: `https://todoical.herokuapp.com/${endpoint}`,
      json: true,
    }
    try {
      const response = await axios(options)
      return response
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const api = {
    get: async (endpoint) => await getOrDelete("get", endpoint),
    delete: async (endpoint) => await getOrDelete("delete", endpoint),
    post: async (endpoint, data) => await postOrPut("post", endpoint, data),
    put: async (endpoint, data) => await postOrPut("put", endpoint, data),
  }

  return api
}

export default useApi