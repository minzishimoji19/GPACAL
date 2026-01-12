import { useState } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  onAdd: (course: Omit<Course, 'id'>) => void;
  semesters?: string[];
}

export default function CourseForm({ onAdd, semesters = [] }: CourseFormProps) {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [score10, setScore10] = useState('');
  const [semester, setSemester] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!courseName.trim()) {
      newErrors.courseName = 'Tên môn học không được để trống';
    }

    const creditsNum = parseFloat(credits);
    if (!credits || isNaN(creditsNum) || creditsNum <= 0 || creditsNum > 6) {
      newErrors.credits = 'Tín chỉ phải là số từ 1 đến 6';
    }

    const scoreNum = parseFloat(score10);
    if (!score10 || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      newErrors.score10 = 'Điểm phải là số từ 0 đến 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      courseCode: courseCode.trim() || undefined,
      courseName: courseName.trim(),
      credits: parseFloat(credits),
      score10: parseFloat(score10),
      semester: semester || undefined
    });

    // Reset form
    setCourseCode('');
    setCourseName('');
    setCredits('');
    setScore10('');
    setSemester('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Thêm môn học</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mã môn (tùy chọn)
          </label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder="VD: MATH101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tên môn học *
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
              errors.courseName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="VD: Toán cao cấp"
          />
          {errors.courseName && (
            <p className="text-red-500 text-xs mt-1">{errors.courseName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tín chỉ *
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            max="6"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
              errors.credits ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="VD: 3"
          />
          {errors.credits && (
            <p className="text-red-500 text-xs mt-1">{errors.credits}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Điểm hệ 10 *
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={score10}
            onChange={(e) => setScore10(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
              errors.score10 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="VD: 8.5"
          />
          {errors.score10 && (
            <p className="text-red-500 text-xs mt-1">{errors.score10}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kỳ học
          </label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            list="semesters"
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder="VD: HK1-2023"
          />
          <datalist id="semesters">
            {semesters.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Thêm môn học
      </button>
    </form>
  );
}

