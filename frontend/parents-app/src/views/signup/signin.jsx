import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const Signup = ({handleSubmitRegister, formData, setIsLogin, handleChange, errors,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [regNumbers, setRegNumbers] = useState([{ value: '' }]);
    const [passwordError, setPasswordError] = useState({length: false, uppercase: false, lowercase: false, digit: false, specialChar: false,});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { searchStudents } = useContext(AuthContext);

    React.useEffect(() => {
      const errors = {
        length: formData.password.length < 8,
        uppercase: !/[A-Z]/.test(formData.password),
        lowercase: !/[a-z]/.test(formData.password),
        digit: !/[0-9]/.test(formData.password),
        specialChar: !/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(formData.password),
      };
    
      setPasswordError(errors);
    }, [formData.password]);
      
    React.useEffect(() => {
      if (
        regNumbers.length > 0 &&  
        formData.username &&
        formData.first_name &&
        formData.last_name &&
        formData.email &&
        formData.phone_number &&
        formData.id_number &&
        formData.occupation &&
        formData.address &&
        formData.password &&
        formData.password2 &&
        !passwordError.length &&
        !passwordError.uppercase &&
        !passwordError.lowercase &&
        !passwordError.digit &&
        !passwordError.specialChar &&
        formData.password === formData.password2
      ) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }, [
      regNumbers, 
      formData,
      passwordError,
      formData.password2,
    ]);
  
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const handleShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
    
    const addRegNumber = () => {
      setRegNumbers([...regNumbers, { value: '' }]);
    };

    const handleRegNumberChange = (index, event) => {
      const updatedRegNumbers = [...regNumbers];
      updatedRegNumbers[index].value = event.target.value;
      setRegNumbers(updatedRegNumbers);
    };

    const removeRegNumber = (index) => {
      const updatedRegNumbers = [...regNumbers];
      updatedRegNumbers.splice(index, 1);
      setRegNumbers(updatedRegNumbers);
    };
    const handleRegNumberSubmit = () => {
      if (regNumbers.every((reg) => reg.value === '')) {
        Swal.fire({
          title: "Please Enter Your Child's Registration Number",
          icon: "error",
          toast: true,
          timer: 3500,
          position: 'center',
          timerProgressBar: false,
          showConfirmButton: false,
        });
        return;
      }
    
      searchStudents(regNumbers).then((response) => {
        if (response && response.message) {
          if (response.error) {
            Swal.fire({
              title: response.message,
              icon: "error",
              toast: true,
              timer: 3500,
              position: 'center',
              timerProgressBar: false,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              title: response.message,
              icon: "question",
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then((result) => {
              if (result.isConfirmed) {
                setShowForm(true);
              }
            });
          }
        } else {
          Swal.fire({
            title: "An error occurred ku sign up page",
            icon: "error",
            toast: true,
            timer: 3500,
            position: 'center',
            timerProgressBar: false,
            showConfirmButton: false,
          });
        }
      });
    };
        
    return (
      <form onSubmit={handleSubmitRegister}>
        <h1>Parents Signup</h1>
  
        {!showForm && (
          <div className="form-input">
            <label>Child's Registration Number(s)</label>
            {regNumbers.map((regNumber, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={regNumber.value}
                  onChange={(event) => handleRegNumberChange(index, event)}
                />
                {regNumbers.length === 1 ? (
                  <button type="button" onClick={addRegNumber}>
                    <b>+</b>
                  </button>
                ) : (
                  <>
                    {index < regNumbers.length - 1 && (
                      <button type="button" onClick={() => removeRegNumber(index)}>
                        <b>-</b>
                      </button>
                    )}
                    {index === regNumbers.length - 1 && (
                      <button type="button" onClick={addRegNumber}>
                        <b>+</b>
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            <button type="button" onClick={handleRegNumberSubmit}>
              Create Parent Account
            </button>
          </div>
        )}
  
        {showForm && (
          <>
            {regNumbers.map((regNumber, index) => (
              <div key={index} className="form-input">
                {regNumbers.length > 1 ? (
                  <label htmlFor={`regnumberInput-${index}`}>
                    Child {index + 1}'s Registration Number
                  </label>
                ) : (
                  <label htmlFor={`regnumberInput-${index}`}>
                    Child's Registration Number
                  </label>
                )}
                <input
                  type="text"
                  id={`regnumberInput-${index}`}
                  name={`regnumber-${index}`}
                  value={regNumber.value}
                  readOnly
                />
                <input
                  type="hidden"
                  name="regnumbers"
                  value={regNumber.value}
                />
              </div>
            ))}
            {
          <><div className="form-input">
                {errors.username && <div className="error-message">{errors.username}</div>}
                <label htmlFor="usernameInput">Username</label>
                <input
                  type="text"
                  id="usernameInput"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange} />
              </div><div className="form-input">
                  {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                  <label htmlFor="firstNameInput">Name(s)</label>
                  <input
                    type="text"
                    id="firstNameInput"
                    name="first_name"
                    placeholder="Name(s)"
                    value={formData.first_name}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                  <label htmlFor="lastNameInput">Surname</label>
                  <input
                    type="text"
                    id="lastNameInput"
                    name="last_name"
                    placeholder="Surname"
                    value={formData.last_name}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.id_number && <div className="error-message">{errors.id_number}</div>}
                  <label htmlFor="NationalIDInput">National ID Number</label>
                  <input
                    type="text"
                    id="NationalIDInput"
                    name="id_number"
                    placeholder="ID Number"
                    value={formData.id_number}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.email && <div className="error-message">{errors.email}</div>}
                  <label htmlFor="emailInput">Email Address</label>
                  <input
                    type="email"
                    id="emailInput"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.phone_number && <div className="error-message">{errors.phone_number}</div>}
                  <label htmlFor="PhoneNumberInput">Phone Number</label>
                  <input
                    type="text"
                    id="PhoneNumberInput"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.occupation && <div className="error-message">{errors.occupation}</div>}
                  <label htmlFor="occupationInput">Occupation</label>
                  <input
                    type="text"
                    id="occupationInput"
                    name="occupation"
                    placeholder="Job Descrition"
                    value={formData.occupation}
                    onChange={handleChange} />
                </div><div className="form-input">
                  {errors.address && <div className="error-message">{errors.address}</div>}
                  <label htmlFor="addressInput">Address</label>
                  <input
                    type="text"
                    id="addressInput"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange} />
                </div><div className="form-input password-input">
                  {errors.password && <div className="error-message">{errors.password}</div>}
                  <label htmlFor="passwordInput">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordInput"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange} />
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={handleShowPassword} />
                  {formData.password && (
                    <ul>

                      <span className={passwordError.length ? 'error' : 'success'}>
                        {passwordError.length ?
                          <i className="fas fa-times"></i>
                          :
                          <i className="fas fa-check"></i>}
                        At least 8 characters long
                      </span>

                      <span className={passwordError.uppercase ? 'error' : 'success'}>
                        {passwordError.uppercase ?
                          <i className="fas fa-times"></i>
                          :
                          <i className="fas fa-check"></i>}
                        At least one uppercase letter
                      </span>

                      <span className={passwordError.lowercase ? 'error' : 'success'}>
                        {passwordError.lowercase ?
                          <i className="fas fa-times"></i>
                          :
                          <i className="fas fa-check"></i>}
                        At least one lowercase letter
                      </span>

                      <span className={passwordError.digit ? 'error' : 'success'}>
                        {passwordError.digit ?
                          <i className="fas fa-times"></i>
                          :
                          <i className="fas fa-check"></i>}
                        At least one digit
                      </span>

                      <span className={passwordError.specialChar ? 'error' : 'success'}>
                        {passwordError.specialChar ?
                          <i className="fas fa-times"></i>
                          :
                          <i className="fas fa-check"></i>}
                        At least one special character
                      </span>

                    </ul>
                  )}
                </div><div className="form-input password-input">
                  {errors.password2 && <div className="error-message">{errors.password2}</div>}
                  <label htmlFor="confirmPasswordInput">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPasswordInput"
                    name="password2"
                    placeholder="Confirm Password"
                    value={formData.password2}
                    onChange={handleChange} />
                  <i
                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={handleShowConfirmPassword} />
                  {formData.password2 && formData.password !== formData.password2 && (
                    <span className='error-message'>
                      <i className="fas fa-times"></i> Passwords do not match
                    </span>
                  )}
                </div>
                <button
                  className={`form-button ${isFormValid ? 'valid' : 'disabled'}`}
                  type="submit" disabled={!isFormValid}>
                  Register
                </button>
                <div>
                  Already have an account?
                  <a
                    className="small text-muted"
                    onClick={() => setIsLogin(true)}
                  >
                    Login Now
                  </a>
                </div></>}</>
    )}
    </form>
  );
  };

export default Signup;
