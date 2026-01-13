import { useState } from 'react';
import { Course } from '../types';
import { calculateProjectedGPA4, calculateTotalCredits } from '../utils/gpa';
import CourseForm from './CourseForm';
import CourseTable from './CourseTable';

interface PlanningToolProps {
  courses: Course[];
  onAddPlanned: (course: Omit<Course, 'id'>) => void;
  onUpdatePlanned: (id: string, course: Partial<Course>) => void;
  onDeletePlanned: (id: string) => void;
  onDuplicatePlanned: (course: Course) => void;
}

export default function PlanningTool({
  courses,
  onAddPlanned,
  onUpdatePlanned,
  onDeletePlanned,
  onDuplicatePlanned
}: PlanningToolProps) {
  const [includePlanned, setIncludePlanned] = useState(true);

  const plannedCourses = courses.filter(c => c.isPlanned);
  const allCourses = includePlanned ? courses : courses.filter(c => !c.isPlanned);
  const projectedGPA = calculateProjectedGPA4(allCourses);
  const totalCreditsWithPlanned = calculateTotalCredits(allCourses, true);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            What-if / Planning
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePlanned}
              onChange={(e) => setIncludePlanned(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Bao gồm môn dự kiến
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90 mb-1">GPA dự kiến (4.0)</div>
            <div className="text-2xl font-bold">{projectedGPA.toFixed(2)}</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90 mb-1">Tổng tín chỉ (bao gồm dự kiến)</div>
            <div className="text-2xl font-bold">{totalCreditsWithPlanned}</div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Thêm các môn học dự kiến để tính toán GPA sau khi hoàn thành. Bạn có thể bật/tắt tính
          toán với các môn dự kiến bằng checkbox phía trên.
        </p>
      </div>

      <CourseForm
        onAdd={(course) => onAddPlanned({ ...course, isPlanned: true })}
        semesters={Array.from(new Set(courses.map(c => c.semester).filter((s): s is string => s !== undefined && s !== null && s !== '')))}
      />

      {plannedCourses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Môn học dự kiến ({plannedCourses.length})
          </h3>
          <CourseTable
            courses={plannedCourses}
            onUpdate={onUpdatePlanned}
            onDelete={onDeletePlanned}
            onDuplicate={onDuplicatePlanned}
            showPlanned={true}
          />
        </div>
      )}
    </div>
  );
}

