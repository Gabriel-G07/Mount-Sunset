import React, { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import AdminInfoHTML from '../views/AdminInformationView';
import AdminDashboardHTML from '../views/AdminDashboardView';
import AdminStaffHTML from '../views/AdminStaffView';
import AdminFeesHTML from '../views/AdminFeesView';
import AdminNoticesHTML from '../views/AdminNoticesView';
import AdminResultsHTML from '../views/AdminResultsView';
import AdminStudentsHTML from '../views/AdminStudentsView'; 
import AdminParentsHTML from '../views/AdminParentsView'; 
import AdminApplicationsHTML from '../views/AdminApplicationsView';
import AdminTimeTablesHTML from '../views/AdminTimeTablesView';
import AdminSettingsHTML from '../views/AdminSettingsView'; 

const AdminDashboardPage = () => {
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
        const response = await axiosInstance.get('/adminstrator/dashboard/', {
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
    const intervalId = setInterval(fetchDashboardInfo, 5000);
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  return <AdminDashboardHTML user={user} dashboardInfo={dashboardInfo} loading={loading} error={error}/>;
};
  
const AdminInformationPage = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState({});
  const [error, setError] = useState(null);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(true);

  const fetchStaffInfo = async () => {
    if (user && isMounted.current) {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/adminstrator/staff/details/', {
          params: {
            timestamp: new Date().getTime()
          }
        });
        setStaffInfo(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          console.error(error);
          setError('Failed to fetch staff information. Please try again later.');
          
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchStaffInfo();
    const intervalId = setInterval(fetchStaffInfo, 5000);
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  return <AdminInfoHTML user={user} staffInfo={staffInfo} loading={loading} error={error}/>;
};

const AdminStaffPage = () => {
  const [staffInfo, setStaffInfo] = useState([]);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaffInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/staff/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setStaffInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffInfo();
    const intervalId = setInterval(fetchStaffInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminStaffHTML user={user} staffInfo={staffInfo} loading={loading} error={error}/>;
};

const AdminStudentsPage = () => {
  const [studentsInfo, setStudentsInfo] = useState([]);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/students/', {
        params: {
          timestamp: new Date().getTime()
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
    const intervalId = setInterval(fetchStudentsInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminStudentsHTML user={user} studentsInfo={studentsInfo} loading={loading} error={error}/>;
};

const AdminParentsPage = () => {
  const [parentsInfo, setParentsInfo] = useState([]);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParentsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/parents/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setParentsInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentsInfo();
    const intervalId = setInterval(fetchParentsInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminParentsHTML user={user} parentsInfo={parentsInfo} loading={loading} error={error}/>;
};

const AdminApplicationsPage = () => {
  const [applicantInfo, setApplicantInfo] = useState([]);
  const [studentsenrolmentInfo, setStudentsEnrolmentsInfo] = useState([]);
  const [applicantStatus, setApplicantStatus] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchApplicantInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/staff/job/applications/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setApplicantInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsEnrolmentsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/students/enrolments/', {
        params: {
          timestamp: new Date().getTime()
        }
      });
      setStudentsEnrolmentsInfo(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplicantInfo();
    const intervalId = setInterval(fetchApplicantInfo, 5000);
    return () => clearInterval(intervalId);
  }, [user?.id]);
  
  useEffect(() => {
    fetchStudentsEnrolmentsInfo();
    const intervalId = setInterval(fetchStudentsEnrolmentsInfo, 5000);
    return () => clearInterval(intervalId);
  }, [user?.id]);

  
  useEffect(() => {
    const checkMatchingEmails = async () => {
      const students = await axiosInstance.get('/adminstrator/students/');
      const staff = await axiosInstance.get('/adminstrator/staff/');
      const jobapplicants = await axiosInstance.get('/adminstrator/staff/job/applications/');
      const studentapplicants = await axiosInstance.get('/adminstrator/students/enrolments/');

      jobapplicants.data.forEach((applicant) => {
        const foundStaff = staff.data.find((staffMember) => staffMember.Email === applicant.Email);
        if (foundStaff) {
          setApplicantStatus((prevStatus) => ({ ...prevStatus, [applicant.Email]: true }));
        }
      });

      studentapplicants.data.forEach((applicant) => {
        const foundStudent = students.data.find((student) => student.Email === applicant.Email);
        if (foundStudent) {
          setStudentStatus((prevStatus) => ({ ...prevStatus, [applicant.Email]: true }));
        }
      });
    };

    checkMatchingEmails();
  }, [axiosInstance]);

  const handleAccept = (applicant, status) => {
    const confirmMessage = `Are you sure you want to ${status ? 'accept' : 'reject'} ${applicant.Name} ${applicant.Surname} as ${applicant.pPosition} at Mount Sunset group of schools?`;
    if (window.confirm(confirmMessage)) {
      const payload = {
        Email: applicant.Email,
      };
      axiosInstance.post('/adminstrator/staff/job/applications/accepted/', payload)
        .then((response) => {
          axiosInstance.get('/adminstrator/staff/job/applications/', {
            params: {
              timestamp: new Date().getTime()
            }
          })
            .then((response) => {
              setApplicantInfo(response.data);
            })
        })
      setApplicantStatus((prevStatus) => ({ ...prevStatus, [applicant.Email]: status }));
    }
  };

  const handleEnrole = (student, status) => {
    const confirmMessage = `Are you sure you want to ${status ? 'enrole' : 'unenrole'} ${student.Name} ${student.Surname} as ${student.Grade_Level} at Mount Sunset group of schools?`;
    if (window.confirm(confirmMessage)) {
      const payload = {
        Email: student.Email,
      };
      axiosInstance.post('/adminstrator/students/enrolments/accepted/', payload)
        .then((response) => {
          axiosInstance.get('adminstrator/students/enrolments/', {
            params: {
              timestamp: new Date().getTime()
            }
          })
            .then((response) => {
              setStudentsEnrolmentsInfo(response.data);
            })
        })
      setStudentStatus((prevStatus) => ({ ...prevStatus, [student.Email]: status }));
    }
  };



  return <AdminApplicationsHTML applicantInfo={applicantInfo} studentsenrolmentInfo={studentsenrolmentInfo}
    applicantStatus={applicantStatus} studentStatus={studentStatus} handleAccept={handleAccept}
    handleEnrole={handleEnrole} loading={loading} error={error}/>;
};
  
const AdminSettingsPage = () => {
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
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to change password');
      });
  };

  return <AdminSettingsHTML 
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

const AdminFeesPage = () => {
  const [feesInfo, setFeesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchFeesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/fees/', {
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
    const intervalId = setInterval(fetchFeesInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminFeesHTML user={user} feesInfo={feesInfo} loading={loading} error={error}/>;
};

const AdminNoticesPage = () => {
  const [noticesInfo, setNoticesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchNoticesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/notices/', {
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
    const intervalId = setInterval(fetchNoticesInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminNoticesHTML user={user} noticesInfo={noticesInfo} loading={loading} error={error} 
  />;
};

const AdminResultsPage = () => {
  const [resultsInfo, setResultsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchResultsInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/results/', {
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
    const intervalId = setInterval(fetchResultsInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminResultsHTML user={user} resultsInfo={resultsInfo} loading={loading} error={error}/>;
};

const AdminTimeTablesPage = () => {
  const [timeTablesInfo, setTimeTablesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const fetchTimeTablesInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/adminstrator/timatables/', {
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
    const intervalId = setInterval(fetchTimeTablesInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <AdminTimeTablesHTML user={user} timeTablesInfo={timeTablesInfo} loading={loading} error={error}/>;
};

export { 
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
};
export default { 
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
};