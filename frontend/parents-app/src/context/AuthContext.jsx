import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens && storedTokens.access) {
      try {
        return jwtDecode(storedTokens.access);
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  });

  const loginParentUser = async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      const response = await axios.post("http://127.0.0.1:8000/admin_token/", {
        username,
        password
      });
  
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));
      localStorage.setItem("authTokens", JSON.stringify(response.data));

      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 700,
        position: 'center',
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error:', error);
      console.error('Error response:', error.response);
  
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Username or password does not exist");
      }
  
      Swal.fire({
        title: error.response.data,
        icon: "error",
        toast: true,
        timer: 1000,
        position: 'center',
        showConfirmButton: false,
      });
    }
  };

  const searchStudents = async (regNumbers) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/parent/register/search/students/", {
        regNumbers: regNumbers.map((reg) => reg.value),
      });
  
      return response.data;
    } catch (error) {
      if (error.response.status === 404) {
        return { message: error.response.data.message, error: true };
      } else {
        throw error;
      }
    }
  };

  const registerParentUser = async (email, regNumbers, username, first_name, last_name, id_number, phone_number, occupation, address, password, password2) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/register/parent/", {
        regNumbers,
        username,
        first_name,
        last_name,
        id_number,
        RegNumber,
        email,
        phone_number,
        occupation,
        address,
        password,
        password2,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Registration Successful, Login Now",
          icon: "success",
          toast: true,
          timer: 1000,
          position: 'center',
          timerProgressBar: false,
          showConfirmButton: false,
        });
      } else {
        const errorData = response.data;
        setError(errorData);
        Swal.fire({
          title: "Registration Failed",
          icon: "error",
          toast: true,
          timer: 1500,
          position: 'center',
          timerProgressBar: false,
          showConfirmButton: true,
          text: Object.keys(errorData).map((key) => {
            return `${key}: ${errorData[key]}`;
          }).join("\n"),
        });
      }
    } catch (error) {
      setError("An error occurred while registering");
      Swal.fire({
        title: "An error occurred while registering",
        icon: "error",
        toast: true,
        timer: 1500,
        position: 'center',
        timerProgressBar: false,
        showConfirmButton: true,
        text: error.response?.data || "An error occurred while registering",
      });
    }
  };

  const logoutParent = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.clear();
    
    Swal.fire({
      title: "You have been logged out...",
      icon: "success",
      toast: true,
      timer: 1500,
      position: 'center',
      timerProgressBar: false,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    if (authTokens) {
      try {
        const decodedUser = jwtDecode(authTokens.access);
        setUser(decodedUser);
      } catch (error) {
        setError("Invalid token");
      }
    }
    setLoading(false);
  }, [authTokens]);

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    searchStudents,
    registerParentUser,
    loginParentUser,
    logoutParent,
    error,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;