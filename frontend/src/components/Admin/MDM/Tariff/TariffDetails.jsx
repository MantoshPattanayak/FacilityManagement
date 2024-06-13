import React, { useState } from 'react';
import './TariffDetails.css'; // Importing CSS file
import AdminHeader from '../../../../common/AdminHeader';

const TariffDetails = () => {
  const initialRows = [
    { time: '5:00am-9:00am', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },
    { time: '9:00am-1:00pm', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },
    { time: '5:00am-3:00pm', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },
    { time: '2:00am-4:00pm', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },
    { time: '1:00am-7:00pm', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },
    { time: '8:00am-1:00pm', sunday: 30, monday: 30, tuesday: 30, wednesday: 30, thursday: 30, friday: 30, saturday: 30 },

  ];

  const [rows, setRows] = useState(initialRows);

  const handleAddRow = () => {
    setRows([...rows, { time: '', sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '' }]);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleEditCell = (index, day, value) => {
    const newRows = rows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, [day]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  return (
    <div>
      <AdminHeader />
      <div className="tariff-container">
        {/* input fields of form................ */}
        <div className="form">
          <div className="dropdown-container">
            <select className="dropdown" >
              <option value="" disabled>Select an option</option>
              <option value="option1">Jaydev Vatika</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <div className="icon">
              ▼
            </div>
          </div>

          <div className="dropdown-container">
            <select className="dropdown" >
              <option value="" disabled>Select an option</option>
              <option value="option1">Park</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <div className="icon">
              ▼
            </div>
          </div>
        </div>

        <div className="text-tariff">
          <div className="heading-text">
            <p className='palce-name-text'>Jaydev Vihar</p>
            <p>Address:-NH-16 Byp road, Khandagiri, Bhubaneswar , Odisha</p>
          </div>
        </div>

        <div className="table-container">
          <div className="table-buttons">
            <button onClick={handleAddRow}>Add Row</button>
            <button>Edit</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="text" 
                      value={row.time} 
                      onChange={(e) => handleEditCell(index, 'time', e.target.value)} 
                    />
                  </td>
                  {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => (
                    <td key={day}>
                      <input 
                        type="text" 
                        value={row[day]} 
                        onChange={(e) => handleEditCell(index, day, e.target.value)} 
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TariffDetails;
