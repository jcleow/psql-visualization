import data from '../../../../data/index_cache_hit.json'
import { type GetStaticProps } from 'next'
import { type DataSet, BarChart } from 'components/BarChart'
import { type ChartData, type ChartOptions } from 'chart.js'
import React, { type ReactElement, type ReactNode } from 'react'
import styles from 'components/BarChart.module.css'
import SideBar from 'components/SideBar'

type IndexCacheHitData = {
	[key: string]: string | number
	table_name: string
	index_name: string
	metric_name: string
	metric_value: number
}

const rawData: IndexCacheHitData[] = data
const compareByMetricValueAscending = (a: IndexCacheHitData, b: IndexCacheHitData): number => {
	return a.metric_value - b.metric_value
}
rawData.sort(compareByMetricValueAscending)

const metricNames: string[] = ['cache hit rate']
const indexNames: string[] = data.map((d) => { return d.index_name })

const generateData = (data: IndexCacheHitData[]): DataSet[] => {
	return metricNames.map((name: string) => ({
		label: name,
		data: data.map((row: IndexCacheHitData) => row.metric_value),
		borderColor: 'rgb(255, 99, 132)',
		backgroundColor: 'rgba(255, 99, 132, 0.5)'
	}))
}

const getOptions = (text: string): ChartOptions<'bar'> => {
	const options: ChartOptions<'bar'> = {
		maintainAspectRatio: false,
		indexAxis: 'y' as const,
		elements: {
			bar: {
				borderWidth: 2
			}
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right' as const
			},
			title: {
				display: true,
				text
			}
		}
	}
	return options
}

type Props = {
	data: Array<ChartData<'bar'>>
	options: any
}

const Charts = (props: Props): JSX.Element => {
	return (
		<>
			{props.data.map((d: any, idx: number) =>
				<div className={styles.FullPageChart}key={`${idx}${styles.Charts}`} >
					<BarChart options={getOptions(d.datasets[0].label)} data={d}/>
				</div>
			)}
		</>
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

export const getStaticProps: GetStaticProps = async () => {
	const chartDataArray: Array<ChartData<'bar'>> = generateData(rawData).map((result) => {
		return {
			labels: indexNames,
			datasets: [result]
		}
	})

	return {
		props: {
			data: chartDataArray
		}
	}
}
