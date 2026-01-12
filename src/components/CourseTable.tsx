import { useState } from 'react';
import { Course, SortField, SortDirection } from '../types';
import { score10ToGPA4 } from '../utils/gpa';

interface CourseTableProps {
  courses: Course[];
  onUpdate: (id: string, course: Partial<Course>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (course: Course) => void;
  showPlanned?: boolean;
}

export default function CourseTable({
  courses,
  onUpdate,
  onDelete,
  onDuplicate,
  showPlanned = false
}: CourseTableProps) {
  const [sortField, setSortField] = useState<SortField>('courseName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Course>>({});

  const displayedCourses = showPlanned
    ? courses
    : courses.filter(c => !c.isPlanned);

  const sortedCourses = [...displayedCourses].sort((a, b) => {
    let aVal: string | number = a[sortField] || '';
    let bVal: string | number = b[sortField] || '';

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setEditValues({
      courseName: course.courseName,
      credits: course.credits,
      score10: course.score10,
      semester: course.semester
    });
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleKeyDown = (e: React.KeyboardEvent, courseId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(courseId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('courseName')}
              >
                <div className="flex items-center gap-2">
                  Tên môn học
                  <SortIcon field="courseName" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('credits')}
              >
                <div className="flex items-center gap-2">
                  Tín chỉ
                  <SortIcon field="credits" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('score10')}
              >
                <div className="flex items-center gap-2">
                  Điểm hệ 10
                  <SortIcon field="score10" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                GPA 4.0
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                Điểm chữ
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('semester')}
              >
                <div className="flex items-center gap-2">
                  Kỳ học
                  <SortIcon field="semester" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Chưa có môn học nào
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => {
                const { gpa4, letter } = score10ToGPA4(course.score10);
                const isEditing = editingId === course.id;

                return (
                  <tr
                    key={course.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      course.isPlanned ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.courseName || ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, courseName: e.target.value })
                          }
                          onKeyDown={(e) => handleKeyDown(e, course.id)}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">
                          {course.courseName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="6"
                          value={editValues.credits || ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, credits: parseFloat(e.target.value) })
                          }
                          onKeyDown={(e) => handleKeyDown(e, course.id)}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">{course.credits}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editValues.score10 || ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, score10: parseFloat(e.target.value) })
                          }
                          onKeyDown={(e) => handleKeyDown(e, course.id)}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">{course.score10}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{gpa4.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          letter === 'A'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : letter === 'B+' || letter === 'B'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : letter === 'C+' || letter === 'C'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {letter}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.semester || ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, semester: e.target.value })
                          }
                          onKeyDown={(e) => handleKeyDown(e, course.id)}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          {course.semester || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(course.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Lưu"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-800"
                            title="Hủy"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(course)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDuplicate(course)}
                            className="text-purple-600 hover:text-purple-800"
                            title="Nhân đôi"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => onDelete(course.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

