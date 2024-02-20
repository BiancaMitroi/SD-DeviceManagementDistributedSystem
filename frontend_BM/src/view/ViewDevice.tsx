import { useCallback, useEffect, useState } from 'react';
import './View.css';
import { jwtDecode } from 'jwt-decode';

interface Data {
    id: number;
    address: string;
    maximumConsumption: number;
    description: string;
}

interface ClassName {
    className: string;
    showId: boolean;
    deviceId: number;
    updateViews: boolean;
    setDeviceId: React.Dispatch<React.SetStateAction<number>>;
    setUpdateViews: React.Dispatch<React.SetStateAction<boolean>>;
    data: Data[];
    createSensor: boolean;
    isChecked: boolean[];
    setIsChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const ViewDevice = (className: ClassName) => {
  console.log(className.data);
  const [value, setValue] = useState("");
  let id: number;

  const token = sessionStorage.getItem("token");
  const decoded = jwtDecode(token ? token : "");

   // State to manage checkbox
  const handleCreateSensor = useCallback(async () => {
    console.log(id);
    try{
        const response = await fetch(`http://localhost:8082/api/v1/sensor/toggle`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                  },
                body: id.toString()
            }
        );
    } catch(err) {
        console.error(err);
    }
    
}, []);

  const handleSensor = (value: number) => {
    // setValue(value); // You might not need this line based on your implementation
    console.log(className.isChecked[value]);
    handleCreateSensor();
  }

  const toggleCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number, value: number) => {
    console.log(id);
    className.setDeviceId(id);
    className.isChecked[value] = !className.isChecked[value];
    className.setIsChecked(className.isChecked); // Toggle checkbox state
    handleSensor(value); // You may handle value change here if needed
  }

  // useEffect(() => {
    
  // }, []);

    return (<div className={className.className}>
        {className.showId && 
                <div><label>{className.deviceId}</label></div>
                }
        <div className='device2'>
        {Array.isArray(className.data) ? (
        <table>
          <thead>
            <tr>
            <th>id</th>
              <th>Address</th>
              <th>Maximum consumption</th>
              <th>Description</th>
              <th>Create sensor</th>
            </tr>
          </thead>
          <tbody>
              {className.data.map((item, value) => (  
              <tr key={item.id}>
                <td><button onClick={() => {className.setDeviceId(Number(item.id))}}>{item.id}</button></td>
                <td>{item.address}</td>
                <td>{item.maximumConsumption}</td>
                <td>{item.description}</td>
                <td>{className.createSensor && <input type='checkbox' checked={className.isChecked[value]}
                        onChange={(e) => {id = item.id; toggleCheckbox(e, item.id, value);}}/>}</td>
              </tr>))}
              </tbody>
              </table>
            ) : (
                <p>Data is not in the expected format.</p>
              )}
        </div>
    </div>);
}

export default ViewDevice;
