import React from 'react';

const Login = ({
  handleSubmitLogin,
  formData,
  handleChange,
  setIsLogin,
  errors,
  handleForgotPassword,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmitLogin}>
      <h2>Mount Sunset Parents</h2>
      <a className="navbar-brand" href="#">
        <img className="image-card" src="https://i.imgur.com/juL1aAc.png" style={{ width: '50%', position: 'center', borderRadius: 'rem' }} />
      </a>
      <div className="form-input">
        <div>
          <label htmlFor="form2Example17">Username</label>
          <input type="text" id="form2Example17" className="form-input" name='username' placeholder="Username" value={formData.username} onChange={handleChange}/>
        </div>
       
        <div className="password-input">
          <label htmlFor="form2Example27">Password</label>  
          <input type="password" id="form2Example27" className="form-input" name='password' placeholder="Password" value={formData.password} onChange={handleChange}/>
          <i 
            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} 
            onClick={handleShowPassword}
          />
        </div>
      </div>

      {errors.username && (
        <div className="error-message">
          {errors.username}
        </div>
      )}

      <div>
        <button className="form-button" type="submit">Login</button>
      </div>

      <div>
        <a className="small text-muted" onClick={handleForgotPassword}>
          Forgot Password?
        </a>
      </div>

      <div>
        Don't have an account? <a className="small text-muted" onClick={() => setIsLogin(false)}>Register Now</a>
      </div>
    </form>
  );
};

export default Login;