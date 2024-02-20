import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const baseURL = `http://localhost:8080/api/v1/users/add`;

const CreateUser = (props: Interface.ManagerProps) => {

    const handleCreateUser = async () => {
        const data = {
            name: props.name,
            email: props.email,
            password: props.password,
            role: props.role
        }

        try {
            Interface.validate(props);
            await fetch(baseURL,
                {
                    method: 'POST',
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

    return (
            <div className='form'>
                <center>
            <table>
                <tbody>
                <tr><td><label>name</label></td><td><input onChange={(e) => { props.setName(e.target.value) }} /></td></tr>
                <tr><td><label>email</label></td><td><input onChange={(e) => { props.setEmail(e.target.value) }} /></td></tr>
                <tr><td><label>password</label></td><td><input type='password' onChange={(e) => { props.setPassword(e.target.value) }} /></td></tr>
                <tr><td><label>role</label></td><td><select onChange={(e) => { props.setRole(e.target.value) }} value={props.role}>
                <option value={"USER"}>User</option>
                <option value={"MANAGER"}>Admin</option>
                </select></td></tr>
                </tbody>
            </table>
            <button onClick={handleCreateUser}>Create</button>
            </center>
            </div>
            
    );
}

export default CreateUser;