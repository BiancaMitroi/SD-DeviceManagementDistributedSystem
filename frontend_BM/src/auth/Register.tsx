import validator from 'validator';
import '../assets/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import * as Interface from '../assets/Interface';
import { useEffect } from 'react';

function validate(data: Interface.RegisterProps) {
    if (!validator.isEmail(data.email)) {
        throw new Error("The email address is not valid!");
    }
    if (!validator.isStrongPassword(data.password)) {
        throw new Error("The password is not valid!");
    }
    if (data.confirm !== data.password) {
        throw new Error("The confirmation is not the same as the password you provided");
    }
}

const Register = (props: Interface.RegisterProps) => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        sessionStorage.removeItem("token");
        try {
            await fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin',
            });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    useEffect(() => {
        if(sessionStorage.getItem("token"))
            handleLogout();
    }, []);

    const register = async () => {
        try{
            validate(props);
            const response = await fetch(
                "http://localhost:8080/api/v1/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            name: props.name,
                            email: props.email, 
                            password: props.password,
                            role: props.role
                        }
                    )
                }
            );
            const token = await response.json();
            sessionStorage.setItem("token", token.access_token);
            Interface.Nav(navigate);
            
        } catch(err) {
            console.error(err);
        }}

    return (
        <div className='back'>
        <div className='paper'>
            <h1>Don't you have an account?</h1>
            <center><table><tbody>
            <tr><td><h4>name</h4></td><td><input onChange={(e) => {props.setName(e.target.value)}}/></td></tr>
            <tr><td><h4>email</h4></td><td><input onChange={(e) => {props.setEmail(e.target.value)}}/></td></tr>
            <tr><td><h4>password</h4></td><td><input type='password' onChange={(e) => {props.setPassword(e.target.value)}}/></td></tr>
            <tr><td><h4>confirm</h4></td><td><input type='password' onChange={(e) => {props.setConfirm(e.target.value)}}/></td></tr>
            </tbody></table></center>
            <button className='button-class' onClick={register}><h4>Register</h4></button>
            <h4>Do you have one? <Link to={"/login"}>Login</Link></h4>
        </div>
        </div>
    );

}
export default Register;