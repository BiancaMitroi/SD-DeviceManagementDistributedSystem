import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './auth/Login';
import Register from "./auth/Register";
import Client from "./client/Client";
import Manager from "./manager/Manager";
import { useState } from "react";
function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("MANAGER");

  const [address, setAddress] = useState("");
  const [maximumConsumption, setMaximumConsumption] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(0);
  const [deviceId, setDeviceId] = useState(0);
  const [updateViews, setUpdateViews] = useState(false);

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
       />} />
      <Route index path="login" element={<Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
       />} />
      <Route path="register" element={<Register
        name={name}
        email={email}
        password={password}
        confirm={confirm}
        role={role}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirm={setConfirm}
        setRole={setRole}
      />} />
      <Route path="manager" element={<Manager
        userId={userId}
        name={name}
        email={email}
        password={password}
        confirm={confirm}
        role={role}
        deviceId={deviceId}
        address={address}
        maximumConsumption={maximumConsumption}
        description={description}
        updateViews={updateViews}
        setUserId={setUserId}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirm={setConfirm}
        setRole={setRole}
        setDeviceId={setDeviceId}
        setAddress={setAddress}
        setMaximumConsumption={setMaximumConsumption}
        setDescription={setDescription}
        setUpdateViews={setUpdateViews}
      />} />
      <Route path="client" element={<Client
      />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
