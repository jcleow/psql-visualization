import indexData from '../../../data/index.json'
import {DataSet, BarChart} from 'components/BarChart'
import {ChartData, ChartOptions} from 'chart.js'
import React from 'react';
import styles from 'components/BarChart.module.css'


interface IndexData {
    [key: string]: number | string;
    table_name: string
    index_name: string
    index_scans_count: number
    index_scan_tuple_read: number
    index_scan_tuple_fetch: number
    index_size: number,
    table_reads_index_count: number,
    table_reads_seq_count: number,
    table_reads_count: number,
    table_writes_count: number,
    table_size: number
  }

const rawData: IndexData[] = indexData;
const metricNames: string[] = Object.keys(indexData[0]).filter((k: string) => typeof rawData[0][k] === 'number');
const indexNames: string[] = indexData.map((d)=> {return d.index_name});

const generateData = (data: IndexData[]): DataSet[] => {
    return metricNames.map((name: string) => ({
        label: name,
        data: data.map((row: IndexData) => row[name] as number),
        borderColor: `rgb(255, 99, 132)`,
        backgroundColor: `rgba(255, 99, 132, 0.5)`,
    }));
};


interface Props {
    data: ChartData<'bar'>[]
    options: any
}



const getOptions = (text: string): ChartOptions<'bar'> =>{
    const options: ChartOptions<'bar'> = {
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        elements: {
                bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: text,
            },
        },
    };
    return options
}

const Charts = (props: Props) =>{
    return (
        <div className={styles.Charts}>
        {props.data.map((d: any, idx: number)=>
            <div className={styles.ChartItem} key={`${idx + styles.Charts}`} >
                <BarChart options={getOptions(d.datasets[0].label)} data={d}/>
            </div>
        )}
        </div>
    )
}

export default Charts;


export async function getStaticProps(){
    const chartDataArray: ChartData<'bar'>[] = generateData(rawData).map((result)=>{
        return {
            labels: indexNames,
            datasets: [result],
        }
    })

    return {
        props:{
            data: chartDataArray
        }
    }
}