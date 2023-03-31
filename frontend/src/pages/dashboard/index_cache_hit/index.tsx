import data from '../../../../data/index_cache_hit.json'
import { type GetStaticProps } from 'next'
import { type DataSet, BarChart } from 'components/BarChart'
import { type ChartOptions } from 'chart.js'
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

const compareByMetricValueAscending = (a: IndexCacheHitData, b: IndexCacheHitData): number => {
	return a.metric_value - b.metric_value
}

const indexNames: string[] = data.map((d) => { return d.index_name })

const generateData = (data: IndexCacheHitData[]): DataSet => {
	data.sort(compareByMetricValueAscending)
	const borderColors: string[] = data.map((row: IndexCacheHitData) => {
		if (row.metric_value < 0.9) {
			return 'rgba(255, 99, 132, 0.2)'
		}
		return 'rgba(0, 255, 255, 0.2)'
	})

	const bgColors: string[] = data.map((row: IndexCacheHitData) => {
		if (row.metric_value < 0.9) {
			return 'rgba(255, 99, 132, 0.5)'
		}
		return 'rgba(0, 255, 255, 0.5)'
	})

	return {
		label: 'Index Cache Hit Rate',
		data: data.map((row: IndexCacheHitData) => row.metric_value),
		borderColor: borderColors,
		backgroundColor: bgColors
	}
}

const getOptions = (text: string): ChartOptions<'bar'> => {
	const options: ChartOptions<'bar'> = {
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
				align: 'center',
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
						size: 15
					}
				}
			},
			y: {
				beginAtZero: false,
				min: 0.25,
				max: 1.0,
				ticks: {
					color: 'white',
					font: {
						size: 14
					},
					stepSize: 0.25
				}
			}
		}
	}
	return options
}

const Charts = (): JSX.Element => {
	const d = generateData(data)
	const chartData = { labels: indexNames, datasets: [d] }

	return (
		<div className={styles.FullPageChart}key={`${styles.Charts}`} >
			<BarChart options={getOptions(d.label)} data={chartData}/>
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

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			data: {
				labels: indexNames,
				datasets: generateData(data)
			}
		}
	}
}
