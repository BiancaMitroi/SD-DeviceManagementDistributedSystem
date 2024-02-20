import styled from 'styled-components';
import ViewUser from '../view/ViewUser';
import './Manager.css';
import { useCallback, useEffect, useState } from 'react';
import CreateUser from '../create/CreateUser';
import UpdateUser from '../update/UpdateUser';
import DeleteUser from '../delete/DeleteUser';
import CreateDevice from '../create/CreateDevice';
import UpdateDevice from '../update/UpdateDevice';
import DeleteDevice from '../delete/DeleteDevice';
import Map from './Map';
import * as Interface from '../assets/Interface';
import ViewDevice from '../view/ViewDevice';
import { useNavigate } from 'react-router-dom';
import WebSocketComponent from '../socket/WebSocketComponent';
import { jwtDecode } from 'jwt-decode';

const Div = styled.div`
    display: flex;
    position: absolute;
    bottom: 1%;
    top: 1%;
    left: 0px;
    right: 0.5%;
`;

const Div2 = styled.div`
  margin-left: 10%;
`;

interface Data {
    id: number;
    address: string;
    maximumConsumption: number;
    description: string;
}

interface MessageConvo {
    from: string;
    content: string;
  }
  
  interface MessageRecord {
    from: string;
    content: MessageConvo[];
  }

const Admin = (props: Interface.ManagerProps) => {
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const adminProps: Interface.ManagerProps = props;
    const className: Interface.ClassName = {className : 'table2'};
    const [tab, setTab] = useState("");
    const userTabs = ["CU", "UU", "DU"];
    const deviceTabs = [ "CD", "UD", "DD"];
    const token = sessionStorage.getItem("token");
    const decoded = (token ? jwtDecode(token) : null) as Interface.Decoded;
    let userMail = decoded.sub;
    let role = decoded.authorities[decoded.authorities.length - 1].authority;

    const [messages, setMessages] = useState<MessageRecord[]>([]);
    const [status, setStatus] = useState<"content" | "seen" | "asigned">("asigned");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [available, setAvailable] = useState<string[]>([]);

    const navigate = useNavigate();

    const [data, setData] = useState<Data[]>([]);

    const handleView = useCallback(async () => {
        try{
            const baseURL = `http://localhost:8081/api/v1/devices/get`;
            const response = await fetch(baseURL,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      }
                }
            );
            const responseData = await response.json();
            setData(responseData);
        } catch(err) {
            console.error(err);
        }
        
    }, [props.updateViews]);

    useEffect(() => {
        handleView();
    }, [handleView]);

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
    Interface.Nav(navigate);
}, [navigate]);

    return (
        <Div >
        
        <div className="sidebar">
            <div className='button'><button onClick={() => {setTab("CU")}}>Create <br/> User </button><img className='img-user' src='src\assets\createuser.png'/></div>
            <div className='button'><button onClick={() => {setTab("UU")}}>Update <br/> User </button><img className='img' src='src\assets\updateuser.png'/></div>
            <div className='button'><button onClick={() => {setTab("DU")}}>Delete <br/> User </button><img className='img-user' src='src\assets\deleteuser.png'/></div>
            <div className='button'><button onClick={() => {setTab("CD")}}>Create <br/> Device </button><img className='img' src='src\assets\createdevice.png'/></div>
            <div className='button'><button onClick={() => {setTab("UD")}}>Update <br/> Device </button><img className='img' src='src\assets\updatedevice.png'/></div>
            <div className='button'><button onClick={() => {setTab("DD")}}>Delete <br/> Device </button><img className='img' src='src\assets\deletedevice.png'/></div>
            <div className='button'><button onClick={() => {setTab("M")}}>Map </button><img className='img-map' src='src\assets\match.png'/></div>
            <div className='button'><button onClick={() => {setTab("C")}}>Chat </button><img className='img-map' src='src\assets\messenger.png'/></div>
            <div className='button'><button onClick={handleLogout}>Logout</button><img className='img-logout2' src='src\assets\logout.png'/></div>
        </div>
        {tab === "C" && <Div2><WebSocketComponent from={userMail} setFrom={setFrom} role={role} messages={messages} setMessages={setMessages} available={available} setAvailable={setAvailable} status={status} setStatus={setStatus} to={to} setTo={setTo} /></Div2>}
        {tab === "CU" && <CreateUser {...adminProps}/>}
        {tab === "UU" && <UpdateUser {...adminProps}/>}
        {tab === "DU" && <DeleteUser {...adminProps}/>}
        {tab === "CD" && <CreateDevice {...adminProps}/>}
        {tab === "UD" && <UpdateDevice {...adminProps}/>}
        {tab === "DD" && <DeleteDevice {...adminProps}/>}
        {tab === "M" && <Map
            userId={props.userId}
            deviceId={props.deviceId}
            setUserId={props.setUserId}
            setDeviceId={props.setDeviceId}
            userMail={props.email}
            setUserMail={props.setEmail}
            data={data}
        />}
        {userTabs.includes(tab) && <ViewUser 
            className='' 
            showId={false} 
            userId={props.userId} 
            setUserId={props.setUserId}
            updateViews={props.updateViews} 
            setUpdateViews={props.setUpdateViews}
            userMail={props.email}
            setUserMail={props.setEmail}
            />}
        {deviceTabs.includes(tab) && <ViewDevice
            className={className.className} 
            showId={false} 
            deviceId={props.deviceId} 
            setDeviceId={props.setDeviceId}
            updateViews={props.updateViews} 
            setUpdateViews={props.setUpdateViews}
            data={data}
            createSensor={false}
            isChecked={isChecked} setIsChecked={setIsChecked} 
            />}
        </Div>
    );
}
export default Admin;