import { useState, useMemo, useEffect } from 'react';
import { Course } from '../types';
import { calculateSemesterGPA4, calculateSemesterGPA10, calculateSemesterCredits } from '../utils/gpa';
import CourseTable from './CourseTable';

interface CourseTableGroupedBySemesterProps {
  courses: Course[];
  onUpdate: (id: string, course: Partial<Course>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (course: Course) => void;
}

export default function CourseTableGroupedBySemester({
  courses,
  onUpdate,
  onDelete,
  onDuplicate
}: CourseTableGroupedBySemesterProps) {
  const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(new Set());

  // Nhóm môn học theo kỳ
  const coursesBySemester = useMemo(() => {
    const completedCourses = courses.filter(c => !c.isPlanned);
    const grouped: Record<string, Course[]> = {
      'Chưa phân loại': []
    };

    completedCourses.forEach(course => {
      const semester = course.semester || 'Chưa phân loại';
      if (!grouped[semester]) {
        grouped[semester] = [];
      }
      grouped[semester].push(course);
    });

    // Sắp xếp các kỳ học (ưu tiên kỳ có tên, sau đó là "Chưa phân loại")
    const sortedSemesters = Object.keys(grouped).sort((a, b) => {
      if (a === 'Chưa phân loại') return 1;
      if (b === 'Chưa phân loại') return -1;
      return a.localeCompare(b);
    });

    return { grouped, sortedSemesters };
  }, [courses]);

  const toggleSemester = (semester: string) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semester)) {
      newExpanded.delete(semester);
    } else {
      newExpanded.add(semester);
    }
    setExpandedSemesters(newExpanded);
  };

  // Mở tất cả các kỳ mặc định khi có dữ liệu
  useEffect(() => {
    if (expandedSemesters.size === 0 && coursesBySemester.sortedSemesters.length > 0) {
      setExpandedSemesters(new Set(coursesBySemester.sortedSemesters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesBySemester.sortedSemesters.length]);

  if (courses.filter(c => !c.isPlanned).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Chưa có môn học nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coursesBySemester.sortedSemesters.map((semester) => {
        const semesterCourses = coursesBySemester.grouped[semester];
        const isExpanded = expandedSemesters.has(semester);
        const semesterGPA4 = calculateSemesterGPA4(courses, semester);
        const semesterGPA10 = calculateSemesterGPA10(courses, semester);
        const semesterCredits = calculateSemesterCredits(courses, semester);

        return (
          <div
            key={semester}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header của kỳ học */}
            <button
              onClick={() => toggleSemester(semester)}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {semester}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {semesterCourses.length} môn học • {semesterCredits} tín chỉ
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-600 dark:text-gray-400">GPA (4.0)</div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {semesterGPA4.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600 dark:text-gray-400">GPA (10.0)</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {semesterGPA10.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Bảng môn học của kỳ */}
            {isExpanded && (
              <div className="p-4">
                <CourseTable
                  courses={semesterCourses}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

