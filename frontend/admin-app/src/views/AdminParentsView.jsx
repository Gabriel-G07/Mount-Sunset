import React from 'react';

const AdminParentsHTML = ({ parentsInfo }) => {
  return (
    <div>
      <h2>Parents Information</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Student(s) RegNumber</th>
            <th>Relationship</th>
            <th>National ID</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Occupation</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {parentsInfo.map(parents => (
            <tr key={parents.Username}>
              <td>{parents.Username}</td>
              <td>{parents.Name}</td>
              <td>{parents.Surname}</td>
              <td>{parents.Student}</td>
              <td>{parents.Relationship}</td>
              <td>{parents.ID_Number}</td>
              <td>{parents.Email}</td>
              <td>{parents.Phone_Number}</td>
              <td>{parents.Occupation}</td>
              <td>{parents.Address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminParentsHTML;