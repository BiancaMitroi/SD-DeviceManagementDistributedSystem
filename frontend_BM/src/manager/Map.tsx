import ViewDevice from '../view/ViewDevice';
import ViewUser from '../view/ViewUser';
import styled from 'styled-components';
import * as Interface from '../assets/Interface';
import { useState } from 'react';

const Div=styled.div`
    position: absolute;
    bottom: 0px;
    width: 100%;
`

    const Map = (props: Interface.IMap) => {
        const [isChecked, setIsChecked] = useState<boolean[]>([]);
        const baseUrl = 'http://localhost:8081/api/v1/devices/map';
        const token = sessionStorage.getItem("token");
        const [updateViews, setUpdateViews] = useState(false);
        const data = {
            userId: props.userId,
            deviceId: props.deviceId,
            userMail: props.userMail
        }
    
        const handleMap = async () => {
            await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                body: JSON.stringify(data),
            });
        }
    
        return (
            <>
            <ViewDevice 
                className='device2' 
                showId={true} 
                deviceId={props.deviceId}
                setDeviceId={props.setDeviceId}
                updateViews={updateViews}
                setUpdateViews={setUpdateViews}
                data={props.data}
                createSensor={false}
                isChecked={isChecked} setIsChecked={setIsChecked} 
                />
            <ViewUser 
                showId={true} 
                className=''
                userId={props.userId}
                setUserId={props.setUserId}
                updateViews={updateViews}
                setUpdateViews={setUpdateViews}
                userMail={props.userMail}
                setUserMail={props.setUserMail}
                />
            <Div><button onClick={handleMap}>Submit</button></Div>
        </>
    );
}

export default Map;