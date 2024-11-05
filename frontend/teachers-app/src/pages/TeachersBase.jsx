import React, { useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/home.css"
import LayoutHTML from '../views/TeachersHomeView';
import { 
  TeachersDashboardPage, 
  TeachersInformationPage, 
  
  TeachersStudentsPage, 
  
  TeachersSettingsPage, 
  
  TeachersNoticesPage, 
  TeachersResultsPage, 
  TeachersTimeTablesPage 
} from '../components/teachers';

function Layout() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('authTokens');
  const [content, setContent] = useState(<TeachersDashboardPage />);
  const [loading, setLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [activeButton, setActiveButton] = useState('admin_dashboard');

  let user_id;

  if (token) {
    const decoded = jwtDecode(token);
    user_id = decoded.user_id;
  }

  useEffect(() => {
    if (token === null) {
      navigate("/admin/signup");
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  const handleNavClick = (e) => {
    const buttonId = e.target.id;
    setActiveButton(buttonId);
    switch (buttonId) {
      case 'admin_dashboard':
        setContent(<TeachersDashboardPage />);
        break;
      case 'admin_personal_info':
        setContent(<TeachersInformationPage />);
        break;
      case 'admin_settings':
        setContent(<TeachersSettingsPage />);
        break;
      case 'admin_staff':
        setContent(<TeachersStaffPage/>);
        break;
      case 'admin_students':
        setContent(<TeachersStudentsPage/>);
        break;
      case 'admin_notices':
        setContent(<TeachersNoticesPage/>);
        break;
      case 'admin_timetables':
        setContent(<TeachersTimeTablesPage/>);
        break;
      case 'admin_reports':
        setContent(<TeachersResultsPage/>);
        break;
      case 'admin_fees':
        setContent(<TeachersFeesPage/>);
        break;
      case 'admin_applications':
        setContent(<TeachersApplicationsPage/>);
        break;
      case 'log_out':
        logoutUser();
        break;
    }
  };

  return <LayoutHTML
    content={content}
    handleNavClick={handleNavClick}
    activeButton={activeButton}
    logoutUser={logoutUser}
  />;
};
export default Layout;