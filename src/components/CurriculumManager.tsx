import { useState } from 'react';
import { CurriculumCourse, CourseCategory } from '../types';
import {
  loadCurriculumFromStorage,
  saveCurriculumToStorage,
  parseCurriculumFromText,
  exportCurriculumToCSV,
  getDefaultMISCurriculum
} from '../utils/curriculum';

interface CurriculumManagerProps {
  onCurriculumChange?: (curriculum: CurriculumCourse[]) => void;
}

export default function CurriculumManager({ onCurriculumChange }: CurriculumManagerProps) {
  const [curriculum, setCurriculum] = useState<CurriculumCourse[]>(() => loadCurriculumFromStorage());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<CurriculumCourse>>({});
  const [pasteText, setPasteText] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);

  const updateCurriculum = (newCurriculum: CurriculumCourse[]) => {
    setCurriculum(newCurriculum);
    saveCurriculumToStorage(newCurriculum);
    onCurriculumChange?.(newCurriculum);
  };

  const handleAdd = () => {
    const newCourse: CurriculumCourse = {
      courseCode: `COURSE_${Date.now()}`,
      courseName: '',
      credits: 3,
      difficulty: 3
    };
    updateCurriculum([...curriculum, newCourse]);
    setEditingId(newCourse.courseCode);
    setEditValues(newCourse);
  };

  const handleUpdate = (courseCode: string, updates: Partial<CurriculumCourse>) => {
    const updated = curriculum.map(c =>
      c.courseCode === courseCode ? { ...c, ...updates } : c
    );
    updateCurriculum(updated);
  };

  const handleDelete = (courseCode: string) => {
    if (confirm('Bạn có chắc muốn xóa môn học này khỏi chương trình?')) {
      updateCurriculum(curriculum.filter(c => c.courseCode !== courseCode));
    }
  };

  const startEdit = (course: CurriculumCourse) => {
    setEditingId(course.courseCode);
    setEditValues({ ...course });
  };

  const saveEdit = (courseCode: string) => {
    handleUpdate(courseCode, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handlePaste = () => {
    try {
      const parsed = parseCurriculumFromText(pasteText);
      if (parsed.length > 0) {
        updateCurriculum([...curriculum, ...parsed]);
        setPasteText('');
        setShowPasteModal(false);
        alert(`Đã thêm ${parsed.length} môn học từ dữ liệu paste`);
      } else {
        alert('Không thể parse dữ liệu. Vui lòng kiểm tra định dạng.');
      }
    } catch (error) {
      alert('Lỗi khi parse dữ liệu: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            updateCurriculum([...curriculum, ...data]);
            alert(`Đã import ${data.length} môn học từ JSON`);
          }
        } else {
          const parsed = parseCurriculumFromText(text);
          if (parsed.length > 0) {
            updateCurriculum([...curriculum, ...parsed]);
            alert(`Đã import ${parsed.length} môn học từ CSV/TSV`);
          }
        }
      } catch (error) {
        alert('Lỗi khi import: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const csv = exportCurriculumToCSV(curriculum);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculum-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadTemplate = () => {
    if (confirm('Tải template MIS 130 tín chỉ? Dữ liệu hiện tại sẽ được thêm vào.')) {
      const template = getDefaultMISCurriculum();
      updateCurriculum([...curriculum, ...template]);
    }
  };

  const totalCredits = curriculum.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Chương trình học
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tổng: {curriculum.length} môn học • {totalCredits} tín chỉ
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasteModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Paste từ Excel
            </button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              Import File
              <input
                type="file"
                accept=".csv,.json,.tsv"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            <button
              onClick={handleLoadTemplate}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Template MIS
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Export CSV
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Thêm môn
            </button>
          </div>
        </div>

        {curriculum.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chưa có môn học nào trong chương trình
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Bạn có thể paste từ Excel, import file, hoặc tải template MIS
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Mã môn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Tên môn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Tín chỉ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Kỳ đề xuất
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Độ khó
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {curriculum.map((course) => {
                  const isEditing = editingId === course.courseCode;

                  return (
                    <tr
                      key={course.courseCode}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.courseCode || ''}
                            onChange={(e) =>
                              setEditValues({ ...editValues, courseCode: e.target.value })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(course.courseCode);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                            {course.courseCode}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.courseName || ''}
                            onChange={(e) =>
                              setEditValues({ ...editValues, courseName: e.target.value })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(course.courseCode);
                              if (e.key === 'Escape') cancelEdit();
                            }}
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
                            max="10"
                            value={editValues.credits || ''}
                            onChange={(e) =>
                              setEditValues({ ...editValues, credits: parseFloat(e.target.value) })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(course.courseCode);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-gray-100">{course.credits}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.recommendedSemester || ''}
                            onChange={(e) =>
                              setEditValues({ ...editValues, recommendedSemester: e.target.value })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                            placeholder="VD: HK1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(course.courseCode);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            {course.recommendedSemester || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editValues.category || ''}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                category: e.target.value as CourseCategory | undefined
                              })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                          >
                            <option value="">-</option>
                            <option value="general">Đại cương</option>
                            <option value="major">Chuyên ngành</option>
                            <option value="elective">Tự chọn</option>
                            <option value="internship">Thực tập</option>
                            <option value="thesis">Đồ án</option>
                          </select>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            {course.category || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editValues.difficulty || 3}
                            onChange={(e) =>
                              setEditValues({ ...editValues, difficulty: parseInt(e.target.value) })
                            }
                            className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-gray-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(course.courseCode);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-900 dark:text-gray-100">
                              {course.difficulty || 3}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded ${
                                    level <= (course.difficulty || 3)
                                      ? 'bg-red-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(course.courseCode)}
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
                              onClick={() => handleDelete(course.courseCode)}
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Paste từ Excel/Sheets
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dán dữ liệu CSV/TSV với các cột: courseCode, courseName, credits, recommendedSemester
              (optional), category (optional), difficulty (optional)
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 font-mono text-sm"
              placeholder="courseCode	courseName	credits&#10;MATH101	Toán cao cấp 1	3"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handlePaste}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Thêm vào chương trình
              </button>
              <button
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteText('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

