import { useCallback, useEffect, useState } from 'react';
import '../manager/Manager.css';
import {jwtDecode} from 'jwt-decode';
import * as Interface from '../assets/Interface';
import { useNavigate } from 'react-router-dom';
import WebSocketComponent from '../socket/WebSocketComponent';
import Graphics from './Graphics';
import ViewDevice from '../view/ViewDevice';
import styled from 'styled-components';

interface Map {
  id: number;
  userId: number;
  deviceId: number;
}

interface SensorData {
  id: number;
  sensorId: number;
  value: number;
  timestamp: string;
  date: string;
}

interface MessageConvo {
  from: string;
  content: string;
}

interface MessageRecord {
  from: string;
  content: MessageConvo[];
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Div = styled.div`
  margin-left: 10%;
`;

const Client = () => {

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  };
    
    const token = sessionStorage.getItem("token");
    const decoded = (token ? jwtDecode(token) : null) as Interface.Decoded;
    let userMail = decoded.sub;
    let role = decoded.authorities[decoded.authorities.length - 1].authority;
    const [devices, setDevices] = useState<Interface.Data[]>([]);
    const [sensorData, setSensorData] = useState<SensorData[]>([]);
    let sensorResponse: SensorData[];
    let mapResponse: Map[];
    const [chartName, setChartName] = useState(0);
    const [value, setValue] = useState<Value>(new Date());
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("");

    const [messages, setMessages] = useState<MessageRecord[]>([]);
    const [status, setStatus] = useState<"content" | "seen" | "asigned">("asigned");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [available, setAvailable] = useState<string[]>([]);

    const [isChecked, setIsChecked] = useState<boolean[]>([]);

    const navigate = useNavigate();

    const getUserIdByEmail = async () => {
        const baseUrl = 'http://localhost:8080/api/v1/users/getByEmail';
        const urlWithParams = `${baseUrl}?email=${decoded.sub}`;
      
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const resp = (response.json() as unknown as Interface.User);
        return resp;
      }
      
      const getDevicesIdByUserId = async (userId: number) => {
        const baseUrl = 'http://localhost:8081/api/v1/devices/getDevicesId';
        const urlWithParams = `${baseUrl}?id=${userId.toString()}`;
      
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      
        return response.json() as unknown as Map[];
      }
      
      const getDevicesByDevicesId = async (deviceIds: number[]) => {
        const baseUrl = 'http://localhost:8081/api/v1/devices/getById';
        const devices = [];
      
        for (let i = 0; i < deviceIds.length; i++) {
          const urlWithParams = `${baseUrl}?id=${deviceIds[i]?.toString()}`;
      
          const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
      
          const responseData = await response.json();
          devices.push(responseData);
        }
      
        return devices;
      }

      const getSensorDataBySensorId = async (sensorIds: number[], value: Value) => {
        const baseUrl = 'http://localhost:8082/api/v1/sensor/getBySensorId';
          const urlWithParams = `${baseUrl}`;
          const formattedDate = new Intl.DateTimeFormat('en-US', options).format(value instanceof Date ? value : new Date());
          const formattedDateWithSpaces = formattedDate.replace(/,/g, '');
          const requestData = {
            sensorIds: sensorIds,
            date: formattedDateWithSpaces,
          };
      
          const response = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
          });
      
          const responseData = await response.json();
      
        return responseData;
      }

    const handleGetDevices = useCallback(async () => {
      setLoading(true)
        try {
          const userIdResponse = await getUserIdByEmail();
      
          mapResponse = await getDevicesIdByUserId(userIdResponse.id);

          const devicesIds = mapResponse.map((item: Map) => item.deviceId);
          const sensorIds = mapResponse.map((item: Map) => item.id);
      
          const devicesResponse = await getDevicesByDevicesId(devicesIds) as unknown as Interface.Data[];
          sensorResponse = await getSensorDataBySensorId(sensorIds, value);
      
          const devices = devicesResponse.map((item: Interface.Data, value: number) => {return {...item,id: sensorIds[value],}});
      
          setDevices(devices);
          setSensorData(sensorResponse);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, [value, chartName]);

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
        handleGetDevices();
    }, [handleGetDevices, value]);

    useEffect(() => {
      Interface.Nav(navigate);
  }, [navigate]);

    return (
        <>
          <div className="sidebar2">
            <div className='button2'><button onClick={handleLogout}>Logout</button><img className='img-logout2' src='src\assets\logout.png'/></div>
            <div className='button2'><button onClick={() => {setTab("D")}}>Devices</button><img className='img-logout2' src='src\assets\devices.png'/></div>
            <div className='button2'><button onClick={() => {setTab("G")}}>Graphics</button><img className='img-logout2' src='src\assets\graph-bar.png'/></div>
            <div className='button2'><button onClick={() => {setTab("C")}}>Chat</button><img className='img-logout' src='src\assets\messenger.png'/></div>
        </div>
        {tab === "D" && <Div><ViewDevice isChecked={isChecked} setIsChecked={setIsChecked} createSensor={true} data={devices} className='' showId={false} deviceId={0} updateViews={false} setUpdateViews={setLoading} setDeviceId={setChartName}/></Div>}
        {tab === "G" && <Graphics devices={devices} sensorData={sensorData} value={value} setValue={setValue} loading={loading} chartName={chartName} setChartName={setChartName} />}
        {tab === "C" && <Div><WebSocketComponent from={userMail} setFrom={setFrom} role={role} messages={messages} setMessages={setMessages} available={available} setAvailable={setAvailable} status={status} setStatus={setStatus} to={to} setTo={setTo} /></Div>}
        </>
    );
}
export default Client;