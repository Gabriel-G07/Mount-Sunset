import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LayoutHTML = ({
  content,
  handleNavClick,
  activeButton,
  logoutParent }) => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [studentInfo, setParentInfo] = useState({});
  const [error, setError] = useState(null);
  const isMounted = React.useRef(false);
  const [loading, setLoading] = useState(true);

  const fetchParentInfo = async () => {
    if (user && isMounted.current) {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/parent/details/', {
          params: {
            timestamp: new Date().getTime()
          }
        });
        setParentInfo(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
          logoutParent();
        } else {
          console.error(error);
          setError('Failed to fetch student information. Please try again later.');
          logoutParent();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      isMounted.current = true;
      fetchParentInfo();
      const intervalId = setInterval(fetchParentInfo, 5000);
      return () => {
        isMounted.current = false;
        clearInterval(intervalId);
      };
    }
  }, [user]);


  return (
    <div className="container">
      <link rel="stylesheet" type="text/css" href="src/styles/home.css"></link>
      <div className="navbar">
        <a className="navbar-brand" href="#">
          <img src="https://i.imgur.com/juL1aAc.png" alt="" />
        </a>
        <div><br></br></div>
        <button className={`nav-button ${activeButton === 'parent_dashboard' ? 'active' : ''}`} id="parent_dashboard" onClick={handleNavClick}>
          <span data-feather="home"></span>
          Home
        </button>
        <button className={`nav-button ${activeButton === 'parent_personal_info' ? 'active' : ''}`} id="parent_personal_info" onClick={handleNavClick}>
          Personal Details
        </button>
        <button className={`nav-button ${activeButton === 'parent_settings' ? 'active' : ''}`} id="parent_settings" onClick={handleNavClick}>
          Settings
        </button>

        <button className={`nav-button ${activeButton === 'parent_students' ? 'active' : ''}`} id="parent_students" onClick={handleNavClick}>
          Child
        </button>
        <button className={`nav-button ${activeButton === 'parent_notices' ? 'active' : ''}`} id="parent_notices" onClick={handleNavClick}>
          Notices
        </button>
        <button className={`nav-button ${activeButton === 'parent_timetables' ? 'active' : ''}`} id="parent_timetables" onClick={handleNavClick}>
          Timetables
        </button>
        <button className={`nav-button ${activeButton === 'parent_reports' ? 'active' : ''}`} id="parent_reports" onClick={handleNavClick}>
          Results
        </button>
        <button className={`nav-button ${activeButton === 'parent_fees' ? 'active' : ''}`} id="parent_fees" onClick={handleNavClick}>
          Fees
        </button>
        <button className="nav-button" id="log_out" onClick={logoutParent}>
          Log Out
        </button>
      </div>
      <div className="header">
        <h1>Mount Sunset Group Of Schools</h1>
      </div>
      <div className="content">{content}</div>
      <div className="footer">
        <p>&copy; Powered By Double G Technologies</p>
      </div>
    </div>
  );
};

export default LayoutHTML;