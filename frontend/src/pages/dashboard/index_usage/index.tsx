// import axios from 'axios'
// import useSWR from 'swr'
import data from '../../../../data/index.json'
import { type DataSet, BarChart } from 'components/BarChart'
import { type ChartData, type ChartOptions } from 'chart.js'
import React, { type ReactElement, type ReactNode } from 'react'
import styles from 'components/BarChart.module.css'
import SideBar from 'components/SideBar'

type IndexData = {
	[key: string]: number | string
	table_name: string
	index_name: string
	index_scans_count: number
	index_scan_tuple_read: number
	index_scan_tuple_fetch: number
	index_size: number
	table_reads_index_count: number
	table_reads_seq_count: number
	table_reads_count: number
	table_writes_count: number
	table_size: number
}

type SortedDataSet = {
	indexNames: string[]
	dataSet: DataSet
}

const generateData = (data: IndexData[]): SortedDataSet[] => {
	const metricNames: string[] = Object.keys(data[0]).filter((k: string) => typeof data[0][k] === 'number')
	return metricNames.map((name: string) => {
		data.sort((a: IndexData, b: IndexData): number => Number(b[name]) - Number(a[name]))
		const metricValues: number[] = data.map((row: IndexData) => row[name] as number)
		const sortedIndexNames: string[] = data.map((row: IndexData) => row.index_name)

		// we can implement some % to change the colour scheme

		return {
			indexNames: sortedIndexNames,
			dataSet: {
				label: name,
				data: metricValues,
				borderColor: 'rgba(0, 255, 255, 0.2)',
				backgroundColor: 'rgba(0, 255, 255, 0.5)'
			}
		}
	})
}

const getOptions = (text: string): ChartOptions<'bar'> => {
	return {
		maintainAspectRatio: false,
		elements: {
			bar: {
				borderWidth: 2
			}
		},
		responsive: true,
		plugins: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text,
				align: 'start',
				color: 'white',
				font: {
					size: 15
				}
			}
		},
		scales: {
			x: {
				ticks: {
					color: 'white',
					font: {
						size: 12
					}
				}
			},
			y: {
				beginAtZero: false,
				ticks: {
					color: 'white',
					font: {
						size: 14
					}
				}
			}
		}
	}
}

const Charts = (): JSX.Element => {
	// const url = 'http://localhost:3333/api/v1/index_usage'
	// const fetcher = async (url: string) => await axios.get(url).then((res) => res.data)
	// const { data } = useSWR<IndexData[]>(url, fetcher)

	// if (data == null) {
	// 	return <></>
	// }

	const chartDataArray: Array<ChartData<'bar'>> = generateData(data)?.map((result) => {
		return {
			labels: result.indexNames,
			datasets: [result.dataSet]
		}
	})

	return (
		<div className={styles.Charts}>
			{chartDataArray.map((d: any, idx: number) =>
				<div className={styles.ChartContainer} key={`${idx}-'chartContainer`}>
					<div className={styles.ChartItem} key={`${idx}${styles.Charts}`} >
						<BarChart options={getOptions(d.datasets[0].label)} data={d}/>
					</div>
				</div>
			)}
		</div>
	)
}

Charts.getLayout = function getLayout (component: ReactElement): ReactNode {
	return (
		<SideBar>
			{component}
		</SideBar>
	)
}

export default Charts
