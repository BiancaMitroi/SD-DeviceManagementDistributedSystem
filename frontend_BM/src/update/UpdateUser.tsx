import { useState } from 'react';
import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const UpdateUser = (props: Interface.ManagerProps) => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('USER');

    const update = async () => {
        const data = {
            name: name,
            email: email,
            password: password,
            role: role
        }
        const baseURL = `http://localhost:8080/api/v1/users/edit?id=${props.userId}`;

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
                    <tr><td>id</td><td><label>{String(props.userId)}</label></td></tr>
                    <tr><td>Name</td><td><input onChange={(e) => { setName(e.target.value) }}/></td></tr>
                    <tr><td>Email</td><td><input onChange={(e) => { setEmail(e.target.value) }}/></td></tr>
                    <tr><td>Password</td><td><input onChange={(e) => { setPassword(e.target.value) }}/></td></tr>
                    <tr><td><label>role</label></td><td><select onChange={(e) => { setRole(e.target.value) }} value={role}>
                    <option value={"USER"}>User</option>
                    <option value={"MANAGER"}>Admin</option>
                    </select></td></tr>
                </tbody>
            </table>
            <button onClick={update}>Submit</button>
            </center>
        </div>
    );
}

export default UpdateUser;