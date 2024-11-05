import axios from "axios";
import { useContext } from "react";
import {AuthContext}  from "../context/AuthContext"; 
import Cookies from 'js-cookie';

const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};

const useAxios = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens && authTokens.access;


  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : null,
      'X-CSRFToken': Cookies.get('csrftoken'),
    }
  });


  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
    return config;
  }, (error) => {
    console.error(error);
    return Promise.reject(error);
  });


  axiosInstance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.status === 401 || error.response.status === 400) {
      const { logoutParent } = useContext(AuthContext);
      logoutParent();
    }
    console.error(error);
    return Promise.reject(error);
  });


  return axiosInstance;
};


export default useAxios;