import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLoginHTML from '../views/AdminLoginView';
import LayoutHTML from '../views/AdminHomeView';
import { 
  AdminDashboardPage, 
  AdminInformationPage, 
  AdminStaffPage, 
  AdminStudentsPage, 
  AdminParentsPage, 
  AdminApplicationsPage, 
  AdminSettingsPage, 
  AdminFeesPage, 
  AdminNoticesPage, 
  AdminResultsPage, 
  AdminTimeTablesPage 
} from '../components/admin';

function Layout() {
  const { user, logoutAdmin, loginAdminUser, registerAdminUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [content, setContent] = useState(<AdminDashboardPage />);
  const [activeButton, setActiveButton] = useState('admin_dashboard');
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavClick = (e) => {
    const buttonId = e.target.id;
    setActiveButton(buttonId);
    switch (buttonId) {
      case 'admin_dashboard':
        setContent(<AdminDashboardPage />);
        break;
      case 'admin_personal_info':
        setContent(<AdminInformationPage />);
        break;
      case 'admin_settings':
        setContent(<AdminSettingsPage />);
        break;
      case 'admin_staff':
        setContent(<AdminStaffPage/>);
        break;
      case 'admin_students':
        setContent(<AdminStudentsPage/>);
        break;
      case 'admin_parents':
        setContent(<AdminParentsPage/>);
        break;
      case 'admin_notices':
        setContent(<AdminNoticesPage/>);
        break;
      case 'admin_timetables':
        setContent(<AdminTimeTablesPage/>);
        break;
      case 'admin_reports':
        setContent(<AdminResultsPage/>);
        break;
      case 'admin_fees':
        setContent(<AdminFeesPage/>);
        break;
      case 'admin_applications':
        setContent(<AdminApplicationsPage/>);
        break;
      case 'log_out':
        logoutAdmin();
        break;
    }
  };


  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrors({ ...errors, username: "Missing Information" });
      return;
    }
    loginAdminUser(formData.username, formData.password).then(() => {
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
      });
    });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      setErrors({ ...errors, username: "All fields are required" });
      return;
    }
    registerAdminUser(
      formData.email,
      formData.username,
      formData.first_name,
      formData.last_name,
      formData.password,
      formData.password2
    ).then(() => {
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
      });
      setIsLogin(true);
    });
  };

  return (
    <div>
      {user ? (
        <LayoutHTML 
        user={user} 
        content={content}
        handleNavClick={handleNavClick}
        activeButton={activeButton}
        logoutAdmin={logoutAdmin} />
      ) : (
        <AdminLoginHTML
          logoutAdmin={logoutAdmin}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleSubmitLogin={handleSubmitLogin}
          handleSubmitRegister={handleSubmitRegister}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          errors={errors}
        />
      )}
    </div>
  );
};

export default Layout;
