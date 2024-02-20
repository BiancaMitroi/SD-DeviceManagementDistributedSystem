import { NavigateFunction } from "react-router-dom";
import validator from "validator";
import { jwtDecode } from 'jwt-decode';

export interface ManagerProps {
    userId:number;
    name: string;
    email:string;
    password:string;
    confirm:string;
    role:string;
    deviceId:number;
    address:string;
    maximumConsumption:number;
    description:string;
    updateViews: boolean;
    setUserId:React.Dispatch<React.SetStateAction<number>>;
    setName:React.Dispatch<React.SetStateAction<string>>;
    setEmail:React.Dispatch<React.SetStateAction<string>>;
    setPassword:React.Dispatch<React.SetStateAction<string>>;
    setConfirm:React.Dispatch<React.SetStateAction<string>>;
    setRole:React.Dispatch<React.SetStateAction<string>>;
    setDeviceId:React.Dispatch<React.SetStateAction<number>>;
    setAddress:React.Dispatch<React.SetStateAction<string>>;
    setMaximumConsumption:React.Dispatch<React.SetStateAction<number>>;
    setDescription:React.Dispatch<React.SetStateAction<string>>;
    setUpdateViews:React.Dispatch<React.SetStateAction<boolean>>;
}

export function validate(data: ManagerProps) {
    if (!(validator.isEmail(data.email)))
        throw new Error("The email address is not valid!");
    if (!(validator.isStrongPassword(data.password)))
        throw new Error("The password is not valid!");
}

export interface ClassName {
    className: string;
}

export interface Authority {
    authority: string;
}

export interface Decoded {
    authorities: [Authority],
    sub: string,
    iat: number,
    exp: number
}

export interface IMap {
    userId: number;
    deviceId: number;
    userMail: string;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
    setDeviceId: React.Dispatch<React.SetStateAction<number>>;
    setUserMail: React.Dispatch<React.SetStateAction<string>>;
    data: Data[]
}

export interface LoginProps {
    email:string;
    password:string;
    setEmail:React.Dispatch<React.SetStateAction<string>>;
    setPassword:React.Dispatch<React.SetStateAction<string>>;
}

export interface RegisterProps {
    name: string;
    email:string;
    password:string;
    confirm:string;
    role:string;
    setName:React.Dispatch<React.SetStateAction<string>>;
    setEmail:React.Dispatch<React.SetStateAction<string>>;
    setPassword:React.Dispatch<React.SetStateAction<string>>;
    setConfirm:React.Dispatch<React.SetStateAction<string>>;
    setRole:React.Dispatch<React.SetStateAction<string>>;
}

export interface Data {
    id: number;
    address: string;
    maximumConsumption: number;
    description: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    enabled: boolean;
    authorities: Authority[];
    username: string;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}

export interface Auth {
    access_token: string;
    refresh_token: string;
}

export function Nav(navigate: NavigateFunction) {
    const token = sessionStorage.getItem("token");
    sessionStorage.setItem("token", token ? token : "");
    const decoded = jwtDecode(token ? token : "") as Decoded;
    if(decoded.authorities.at(1)?.authority === "ROLE_USER")
        navigate("/client");
    if(decoded.authorities.at(4)?.authority === "ROLE_MANAGER")
        navigate("/manager");
}