import { useState } from 'react';
import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const DeleteUser = (props: Interface.ManagerProps) => {

    const deleteUser = async () => {
        const baseURL = `http://localhost:8080/api/v1/users/delete?id=${props.userId}`;

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
                    <tr><td>id</td><td><label>{String(props.userId)}</label></td></tr>
                </tbody>
            </table>
            <button onClick={deleteUser}>Submit</button>
            </center>
        </div>
    );
}

export default DeleteUser;