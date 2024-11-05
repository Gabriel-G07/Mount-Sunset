import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import ParentLoginHTML from '../views/ParentsLoginView';
import LayoutHTML from '../views/ParentsHomeView';
import { 
  ParentDashboardPage, 
  ParentInformationPage, 
  ParentStudentsPage, 
  ParentSettingsPage, 
  ParentFeesPage, 
  ParentNoticesPage, 
  ParentResultsPage, 
  ParentTimeTablesPage 
} from '../components/parents';

function Layout() {
  const { user, logoutParent, loginParentUser, registerParentUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [regNumbers, setRegNumbers] = React.useState([]);
  const [content, setContent] = useState(<ParentDashboardPage />);
  const [activeButton, setActiveButton] = useState('parent_dashboard');
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    id_number: '',
    email: '',
    phone_number: '',
    occupation: '',
    address: '',
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
      case 'parent_dashboard':
        setContent(<ParentDashboardPage />);
        break;
      case 'parent_personal_info':
        setContent(<ParentInformationPage />);
        break;
      case 'parent_settings':
        setContent(<ParentSettingsPage />);
        break;
      case 'parent_students':
        setContent(<ParentStudentsPage/>);
        break;
      case 'parent_notices':
        setContent(<ParentNoticesPage/>);
        break;
      case 'parent_timetables':
        setContent(<ParentTimeTablesPage/>);
        break;
      case 'parent_reports':
        setContent(<ParentResultsPage/>);
        break;
      case 'parent_fees':
        setContent(<ParentFeesPage/>);
        break;
      case 'log_out':
        logoutParent();
        break;
    }
  };


  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrors({ ...errors, username: "Missing Information" });
      return;
    }
    loginParentUser(formData.username, formData.password).then(() => {
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        id_number: '',
        email: '',
        phone_number: '',
        occupation: '',
        address: '',
        password: '',
        password2: '',
      });
    });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (
      !regNumbers.length ||
      !formData.username ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.id_number ||
      !formData.email ||
      !formData.phone_number ||
      !formData.occupation ||
      !formData.address ||
      !formData.password ||
      !formData.password2
    ) {
      setErrors({ ...errors, username: "All fields are required" });
      return;
    }
    registerParentUser(
      regNumbers,
      formData.email,
      formData.username,
      formData.first_name,
      formData.last_name,
      formData.id_number,
      formData.phone_number,
      formData.occupation,
      formData.address,
      formData.password,
      formData.password2
    ).then(() => {
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        id_number: '',
        email: '',
        phone_number: '',
        occupation: '',
        address: '',
        password: '',
        password2: '',
      });
      setRegNumbers([]);
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
        logoutParent={logoutParent} />
      ) : (
        <ParentLoginHTML
          logoutParent={logoutParent}
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
