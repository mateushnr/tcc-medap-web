import type { PatientPrescriptionLineChartData } from '@/pages/dashboard/index.page'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface LineChartPrescriptionPatientProps {
  dataLineChart: PatientPrescriptionLineChartData[]
}

export default function LineChartPrescriptionPatient({
  dataLineChart,
}: LineChartPrescriptionPatientProps) {
  return (
    <LineChart
      width={730}
      height={250}
      data={dataLineChart}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pacientes" stroke="#8884d8" />
      <Line type="monotone" dataKey="receitas" stroke="#82ca9d" />
    </LineChart>
  )
}
