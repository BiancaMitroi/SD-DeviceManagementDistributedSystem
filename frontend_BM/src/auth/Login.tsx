import '../assets/Auth.css';
import validator from 'validator';
import { Link, useNavigate } from 'react-router-dom';
import * as Interface from '../assets/Interface';
import { useEffect } from 'react';

function validate(data: Interface.LoginProps) {
    if (!(validator.isEmail(data.email)))
        throw new Error("The email address is not valid!");
    if (!(validator.isStrongPassword(data.password)))
        throw new Error("The password is not valid!");
}

const Login = (props: Interface.LoginProps) => {

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

    const login = async () => {
        const body = JSON.stringify(
            {
                email: props.email, 
                password: props.password
            }
        )
        try{
            validate(props);
            const response = await fetch(
                "http://localhost:8080/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: body,
                },
            );
            const token = await response.json();
            sessionStorage.setItem("token", token.access_token);
            Interface.Nav(navigate);
            
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className='back'>
        <div className='paper'>
            <h1>You have an account?</h1>
            <center><table><tbody>
            <tr><td><h4>email</h4></td><td><input onChange={(e) => {props.setEmail(e.target.value)}}/></td></tr>
            <tr><td><h4>password</h4></td><td><input type='password' onChange={(e) => {props.setPassword(e.target.value)}}/></td></tr>
            </tbody></table></center>
            <button className='button-class' onClick={login}><h4>Login</h4></button>
            <h4>You don't have one? <Link to={"/register"}>Register</Link></h4>
        </div>
        </div>
    );
}
export default Login;