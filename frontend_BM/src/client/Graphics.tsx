import Calendar from 'react-calendar';
import Chart from './Chart';
import * as Interface from '../assets/Interface';
import styled from 'styled-components';

interface SensorData {
    id: number;
    sensorId: number;
    value: number;
    timestamp: string;
    date: string;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface GraphicsProps {
    devices: Interface.Data[];
    sensorData: SensorData[];
    value: Value;
    setValue: React.Dispatch<React.SetStateAction<Value>>;
    loading: boolean;
    chartName: number;
    setChartName: React.Dispatch<React.SetStateAction<number>>;
}

const Div = styled.div`
  margin-left: 10%;
`;

const Graphics = (props: GraphicsProps) => {
    
    return(
    <Div><select onChange={(e) => { props.setChartName(Number(e.target.value)) }} value={props.chartName}>
    <option>{0}</option>
    {props.devices?.map((item) => {return <option>{item.id}</option>})}
  </select>
  <Calendar onChange={props.setValue} value={props.value} />
  {!props.loading && <Chart 
  threshold={props.devices
    .filter(item => item.id === props.chartName)
    .map(item => item.maximumConsumption)[0]} 
  chartName={props.chartName} 
  values={props.sensorData
    .filter(item => item.sensorId === props.chartName)
    .slice(-25)
    .map((item: SensorData) => {return item.value})} 
  timestamps={props.sensorData
    .filter(item => item.sensorId === props.chartName)
    .slice(-25)
    .map((item: SensorData) => {return item.timestamp})} />}
    </Div>);
}

export default Graphics;