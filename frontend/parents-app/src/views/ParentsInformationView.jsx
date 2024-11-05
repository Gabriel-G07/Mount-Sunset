import React from 'react';

const ParentInfoHTML = ({ parentInfo, students, error, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Parent Information</h2>
        <p>Username: {parentInfo.Username}</p>
        <p>Name: {parentInfo.Name}</p>
        <p>Surname: {parentInfo.Surname}</p>
        <p>Gender: {parentInfo.Gender}</p>
        <p>Position: {parentInfo.Position}</p>
        <p>DOB: {parentInfo.DOB}</p>
        <p>Marital Status: {parentInfo.Marital_Status}</p>
        <p>Email: {parentInfo.Email}</p>
      </div>

      <h2>Students</h2>
      {students.length > 0 ? (
        students.map((student) => (
          <div key={student.Student_ID}>
            <h3>{student.Name} {student.Surname}</h3>
            <p>Student ID: {student.Student_ID}</p>
            <p>Grade: {student.Grade}</p>
            <p>Date of Birth: {student.DOB}</p>
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

export default ParentInfoHTML;