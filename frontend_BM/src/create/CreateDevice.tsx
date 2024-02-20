import '../assets/Form.css';
import * as Interface from '../assets/Interface';

const baseURL = `http://localhost:8081/api/v1/devices/add`;

const CreateDevice = (props: Interface.ManagerProps) => {

    const createDevice = async () => {
        const data = {
            address: props.address,
            maximumConsumption: props.maximumConsumption,
            description: props.description
        }

        try {
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
                <tr><td><label>address</label></td><td><input onChange={(e) => { props.setAddress(e.target.value) }} /></td></tr>
                <tr><td><label>maximum consumption</label></td><td><input onChange={(e) => { props.setMaximumConsumption(Number(e.target.value)) }} /></td></tr>
                <tr><td><label>description</label></td><td><input onChange={(e) => { props.setDescription(e.target.value) }} /></td></tr>
                </tbody>
            </table>
            <button onClick={createDevice}>Create</button>
            </center>
            </div>
            
    );
}

export default CreateDevice;