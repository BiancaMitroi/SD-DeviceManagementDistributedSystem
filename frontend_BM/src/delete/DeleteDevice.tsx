import { useState } from 'react';
import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const DeleteDevice = (props: Interface.ManagerProps) => {

    const deleteDevice = async () => {
        const baseURL = `http://localhost:8081/api/v1/devices/delete?id=${props.deviceId}`;

        try {
            await fetch(baseURL,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                      },
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
                </tbody>
            </table>
            <button onClick={deleteDevice}>Submit</button>
            </center>
        </div>
    );
}

export default DeleteDevice;