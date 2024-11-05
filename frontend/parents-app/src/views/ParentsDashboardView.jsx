import React from 'react';

const ParentDashboard = ({ user, children, fees }) => {
  return (
    <div>
      <h1>Hello, {user?.first_name} {user?.last_name}!</h1>
      <p>Your email is {user.email}</p>
      <p>Welcome to your dashboard!</p>
      
      {/* Children Panel */}
      <div className="panel">
        <h2>Children</h2>
        {children.map((child, index) => (
          <div key={index} className="child-profile">
            <img src={child.profile_photo} alt={child.name} />
            <p>{child.name} {child.surname}</p>
          </div>
        ))}
        <div className="add-child">
          <span>+ Add Another Child</span>
        </div>
      </div>
      
      {/* Finance and Accounting Panel */}
      <div className="panel">
        <h2>Finance and Accounting</h2>
        <p>Total Fees: ${fees.total}</p>
        {children.map((child, index) => (
          <div key={index} className="student-fees">
            <img src={child.profile_photo} alt={child.name} />
            <p>{child.name} {child.surname}</p>
            <p>Fees: ${fees.students[index]}</p>
          </div>
        ))}
      </div>
      
      {/* Additional panels */}
      <div className="panel">
        <h2>Upcoming Events</h2>
        <p>No upcoming events</p>
      </div>
      <div className="panel">
        <h2>Messages</h2>
        <p>No new messages</p>
      </div>
    </div>
  );
};

export default ParentDashboard;