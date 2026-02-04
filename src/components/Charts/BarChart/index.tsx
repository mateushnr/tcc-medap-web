'use client'

import type { MedicineCount } from '@/pages/dashboard/index.page'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface BarChartMedicineProps {
  dataBarChart: MedicineCount[]
}

export default function BarChartMedicine({
  dataBarChart,
}: BarChartMedicineProps) {
  return (
    <BarChart width={730} height={250} data={dataBarChart}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="quantidade" fill="#8884d8" />
    </BarChart>
  )
}
