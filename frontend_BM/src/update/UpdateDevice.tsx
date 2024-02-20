import { useState } from 'react';
import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const UpdateDevice = (props: Interface.ManagerProps) => {

    const [address, setAddress] = useState<string>('');
    const [maximumConsumption, setMaximumConsumption] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    const update = async () => {
        const data = {
            address: address,
            maximumConsumption: maximumConsumption,
            description: description
        }
        const baseURL = `http://localhost:8081/api/v1/devices/edit?id=${props.deviceId}`;

        try {
            await fetch(baseURL,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                      },
                    body: JSON.stringify(data),
                }
                );
                props.setUpdateViews(true);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    }
    return(
        <div className='form'>
            <center>
            <table>
                <tbody>
                    <tr><td>id</td><td><label>{String(props.deviceId)}</label></td></tr>
                    <tr><td><label>address</label></td><td><input onChange={(e) => { setAddress(e.target.value) }} /></td></tr>
                <tr><td><label>maximum onsumption</label></td><td><input onChange={(e) => { setMaximumConsumption(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>description</label></td><td><input onChange={(e) => { setDescription(e.target.value) }} /></td></tr>
                </tbody>
            </table>
            <button onClick={update}>Submit</button>
            </center>
        </div>
    );
}

export default UpdateDevice;