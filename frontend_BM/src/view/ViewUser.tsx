import { useCallback, useEffect, useState } from 'react';
import './View.css';
const baseURL = `http://localhost:8080/api/v1/users/get`;
interface ClassName {
    className: string;
    showId: boolean;
    userId: number;
    updateViews: boolean;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
    setUpdateViews: React.Dispatch<React.SetStateAction<boolean>>;
    userMail: string;
    setUserMail: React.Dispatch<React.SetStateAction<string>>;
}
interface Authority {
    authority: string;
}
interface Data {
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
const ViewUser = (className: ClassName) => {
    const [data, setData] = useState<Data[]>();

    const handleView = useCallback(async () => {
        try{
            const response = await fetch(baseURL,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                      }
                }
            );
            const responseData = await response.json();
            setData(responseData);
            className.setUpdateViews(false);
        } catch(err) {
            console.error(err);
        }
        
    }, [className.updateViews]);

    useEffect(() => {
        handleView();
    }, [handleView]);

    return (<div className='table2'>
        {className.showId && 
                <div><label>{className.userId}</label></div>
                }
{Array.isArray(data) ? (
        <table>
          <thead>
            <tr>
            <th>id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
              {data.map(item => (  
              <tr key={item.id}>
                <td><button onClick={() => {className.setUserId(Number(item.id)); className.setUserMail(item.email)}}>{item.id}</button></td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
              </tr>))}
              </tbody>
              </table>
            ) : (
                <p>Data is not in the expected format.</p>
              )}
    </div>);
}
export default ViewUser;