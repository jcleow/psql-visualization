import React from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	type ChartData
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)

export type DataSet = {
	label: string
	data: number[]
	borderColor: string
	backgroundColor: string
}

export type DefinedChartData = {
	labels: string
	datasets: DataSet
}

export type BarChartProps = {
	options: any
	data: ChartData<'bar'>
}

export function BarChart ({ options, data }: BarChartProps) {
	return <Bar options={options} data={data} />
}
