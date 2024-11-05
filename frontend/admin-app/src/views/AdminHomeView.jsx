import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LayoutHTML = ({
  content,
  handleNavClick,
  activeButton,
  logoutAdmin }) => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [studentInfo, setAdminInfo] = useState({});
  const [error, setError] = useState(null);
  const isMounted = React.useRef(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminInfo = async () => {
    if (user && isMounted.current) {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/adminstrator/staff/details/', {
          params: {
            timestamp: new Date().getTime()
          }
        });
        setAdminInfo(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
          logoutAdmin();
        } else {
          console.error(error);
          setError('Failed to fetch student information. Please try again later.');
          logoutAdmin();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      isMounted.current = true;
      fetchAdminInfo();
      const intervalId = setInterval(fetchAdminInfo, 5000);
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
        <button className={`nav-button ${activeButton === 'admin_dashboard' ? 'active' : ''}`} id="admin_dashboard" onClick={handleNavClick}>
          <span data-feather="home"></span>
          Home
        </button>
        <button className={`nav-button ${activeButton === 'admin_personal_info' ? 'active' : ''}`} id="admin_personal_info" onClick={handleNavClick}>
          Personal Details
        </button>
        <button className={`nav-button ${activeButton === 'admin_settings' ? 'active' : ''}`} id="admin_settings" onClick={handleNavClick}>
          Settings
        </button>
        <button className={`nav-button ${activeButton === 'admin_staff' ? 'active' : ''}`} id="admin_staff" onClick={handleNavClick}>
          Staff
        </button>
        <button className={`nav-button ${activeButton === 'admin_students' ? 'active' : ''}`} id="admin_students" onClick={handleNavClick}>
          Students
        </button>
        <button className={`nav-button ${activeButton === 'admin_parents' ? 'active' : ''}`} id="admin_parents" onClick={handleNavClick}>
          Parents
        </button>
        <button className={`nav-button ${activeButton === 'admin_notices' ? 'active' : ''}`} id="admin_notices" onClick={handleNavClick}>
          Notices
        </button>
        <button className={`nav-button ${activeButton === 'admin_timetables' ? 'active' : ''}`} id="admin_timetables" onClick={handleNavClick}>
          Timetables
        </button>
        <button className={`nav-button ${activeButton === 'admin_reports' ? 'active' : ''}`} id="admin_reports" onClick={handleNavClick}>
          Results
        </button>
        <button className={`nav-button ${activeButton === 'admin_fees' ? 'active' : ''}`} id="admin_fees" onClick={handleNavClick}>
          Fees
        </button>
        <button className={`nav-button ${activeButton === 'admin_applications' ? 'active' : ''}`} id="admin_applications" onClick={handleNavClick}>
          Applications
        </button>
        <button className="nav-button" id="log_out" onClick={logoutAdmin}>
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