import React, { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import ParentInfoHTML from '../views/ParentsInformationView';
import ParentDashboardHTML from '../views/ParentsDashboardView';
import ParentFeesHTML from '../views/ParentsFeesView';
import ParentNoticesHTML from '../views/ParentsNoticesView';
import ParentResultsHTML from '../views/ParentsResultsView';
import ParentStudentsHTML from '../views/ParentsStudentsView'; 
import ParentTimeTablesHTML from '../views/ParentsTimeTablesView';
import ParentSettingsHTML from '../views/ParentsSettingsView'; 

const ParentDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const [dashboardInfo, setDashboardInfo] = useState({});
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardInfo = async () => {
    if (user && isMounted.current) {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/parent/dashboard/', {
          params: {
            timestamp: new Date().getTime()
          }
        });
        setDashboardInfo(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
    isMounted.current = true;
  }, []);

  return <ParentDashboardHTML user={user} dashboardInfo={dashboardInfo} loading={loading} error={error}/>;
};
  
const ParentInformationPage = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [parentInfo, setParentInfo] = useState({});
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(true);

  const fetchParentInfo = async () => {
    if (user && isMounted.current) {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/parent/details/');
        setParentInfo(response.data.Parent);
        setStudents(response.data.Students);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchParentInfo();
  }, []);

  return (
    <ParentInfoHTML
      user={user}
      parentInfo={parentInfo}
      students={students}
      loading={loading}
      error={error}
    />
  );
};

const ParentStudentsPage = () => {
  const [studentsInfo, setStudentsInfo] = useState([]);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/students/', {
        params: {
        }
      });
      setStudentsInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsInfo();
  }, []);

  return <ParentStudentsHTML user={user} studentsInfo={studentsInfo} loading={loading} error={error}/>;
};

const ParentSettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (!passwordRegex.test(newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters, contain at least one letter and one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
    };
    axiosInstance.post('/user/settings/', payload)
      .then((response) => {
        alert('Password changed successfully');
        navigate('/parent/dashboard');
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to change password');
      });
  };

  return <ParentSettingsHTML 
    currentPassword={currentPassword} 
    newPassword={newPassword} 
    confirmPassword={confirmPassword} 
    handleSubmit={handleSubmit} 
    setCurrentPassword={setCurrentPassword} 
    setNewPassword={setNewPassword} 
    setConfirmPassword={setConfirmPassword} 
    errors={errors} 
  />;
};

const ParentFeesPage = () => {
  const [feesInfo, setFeesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchFeesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/parent/fees/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setFeesInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesInfo();
  }, []);

  return <ParentFeesHTML user={user} feesInfo={feesInfo} loading={loading} error={error}/>;
};

const ParentNoticesPage = () => {
  const [noticesInfo, setNoticesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchNoticesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/parent/notices/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setNoticesInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticesInfo();
  }, []);

  return <ParentNoticesHTML user={user} noticesInfo={noticesInfo} loading={loading} error={error} 
  />;
};

const ParentResultsPage = () => {
  const [resultsInfo, setResultsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchResultsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/parent/results/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setResultsInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultsInfo();
  }, []);

  return <ParentResultsHTML user={user} resultsInfo={resultsInfo} loading={loading} error={error}/>;
};

const ParentTimeTablesPage = () => {
  const [timeTablesInfo, setTimeTablesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchTimeTablesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/parent/timatables/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setTimeTablesInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeTablesInfo();
  }, []);

  return <ParentTimeTablesHTML user={user} timeTablesInfo={timeTablesInfo} loading={loading} error={error}/>;
};

export { 
  ParentDashboardPage, 
  ParentInformationPage, 
  ParentStudentsPage, 
  ParentSettingsPage, 
  ParentFeesPage, 
  ParentNoticesPage, 
  ParentResultsPage, 
  ParentTimeTablesPage 
};
export default { 
  ParentDashboardPage, 
  ParentInformationPage, 
  ParentStudentsPage,
  ParentSettingsPage, 
  ParentFeesPage, 
  ParentNoticesPage, 
  ParentResultsPage, 
  ParentTimeTablesPage 
};