import { Course } from '../types';
import {
  calculateGPA4,
  calculateGPA10,
  calculateQualityPoints,
  calculateTotalCredits
} from '../utils/gpa';
import { getGradeDistribution } from '../utils/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  courses: Course[];
  includePlanned?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

export default function Dashboard({ courses, includePlanned = false }: DashboardProps) {
  const gpa4 = calculateGPA4(courses);
  const gpa10 = calculateGPA10(courses);
  const qualityPoints = calculateQualityPoints(courses);
  const totalCredits = calculateTotalCredits(courses, includePlanned);
  const distribution = getGradeDistribution(courses);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="text-sm opacity-90 mb-1">GPA tích lũy (4.0)</div>
          <div className="text-3xl font-bold">{gpa4.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="text-sm opacity-90 mb-1">GPA tích lũy (10.0)</div>
          <div className="text-3xl font-bold">{gpa10.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="text-sm opacity-90 mb-1">Tổng Quality Points</div>
          <div className="text-3xl font-bold">{qualityPoints.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="text-sm opacity-90 mb-1">Tổng tín chỉ</div>
          <div className="text-3xl font-bold">{totalCredits}</div>
        </div>
      </div>

      {distribution.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Phân bố điểm theo tín chỉ (Bar Chart)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="letter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="credits" fill="#3b82f6" name="Tín chỉ" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Phân bố điểm theo tín chỉ (Pie Chart)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ letter, credits, percent }) =>
                    `${letter}: ${credits} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="credits"
                >
                  {distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {distribution.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có dữ liệu để hiển thị biểu đồ
        </div>
      )}
    </div>
  );
}

