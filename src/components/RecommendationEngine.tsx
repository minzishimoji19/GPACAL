import { useState, useEffect } from 'react';
import { CurriculumCourse, Course, RecommendationStrategy, RecommendedCourse } from '../types';
import { generateRecommendation, RecommendationConfig } from '../utils/recommendation';

interface RecommendationEngineProps {
  curriculum: CurriculumCourse[];
  courses: Course[];
  targetGPA: number;
  totalProgramCredits: number;
  onApplyPlan?: (recommendedCourses: RecommendedCourse[]) => void;
}

export default function RecommendationEngine({
  curriculum,
  courses,
  targetGPA,
  totalProgramCredits,
  onApplyPlan
}: RecommendationEngineProps) {
  const [config, setConfig] = useState<RecommendationConfig>({
    targetGPA,
    totalProgramCredits,
    maxCreditsPerTerm: 18,
    termCountToPlan: 2,
    strategy: 'balanced',
    baselineGPA: 3.0,
    mode: 'simple'
  });

  const [result, setResult] = useState<ReturnType<typeof generateRecommendation> | null>(null);

  useEffect(() => {
    if (curriculum.length === 0) {
      setResult(null);
      return;
    }

    const completedCourses = courses.filter(c => !c.isPlanned);
    const recommendation = generateRecommendation(curriculum, completedCourses, {
      ...config,
      targetGPA,
      totalProgramCredits
    });
    setResult(recommendation);
  }, [curriculum, courses, targetGPA, totalProgramCredits, config]);

  const handleApplyPlan = () => {
    if (result && result.plan.length > 0 && onApplyPlan) {
      onApplyPlan(result.plan);
      alert(`Đã thêm ${result.plan.length} môn học vào Planned Courses`);
    }
  };

  if (curriculum.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Chưa có chương trình học.</strong> Vui lòng vào tab "Chương trình học" để nhập
          hoặc import chương trình trước.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Gợi ý đăng ký & điểm cần đạt
      </h2>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chiến lược
          </label>
          <select
            value={config.strategy}
            onChange={(e) =>
              setConfig({ ...config, strategy: e.target.value as RecommendationStrategy })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            <option value="easiest">Dễ nhất trước</option>
            <option value="mostImpact">Tác động lớn nhất (nhiều tín chỉ)</option>
            <option value="balanced">Cân bằng</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số kỳ muốn plan
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={config.termCountToPlan}
            onChange={(e) =>
              setConfig({ ...config, termCountToPlan: parseInt(e.target.value) || 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max tín chỉ/kỳ
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={config.maxCreditsPerTerm}
            onChange={(e) =>
              setConfig({ ...config, maxCreditsPerTerm: parseInt(e.target.value) || 18 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Baseline GPA (cho môn còn lại)
          </label>
          <input
            type="range"
            min="2.0"
            max="3.5"
            step="0.1"
            value={config.baselineGPA}
            onChange={(e) =>
              setConfig({ ...config, baselineGPA: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            {config.baselineGPA.toFixed(1)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chế độ tính toán
          </label>
          <select
            value={config.mode}
            onChange={(e) =>
              setConfig({ ...config, mode: e.target.value as 'simple' | 'optimized' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            <option value="simple">Đơn giản (phân bổ đều)</option>
            <option value="optimized">Tối ưu (greedy algorithm)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">GPA cần đạt (tổng thể)</div>
                <div
                  className={`text-2xl font-bold ${
                    result.feasibility === 'impossible'
                      ? 'text-red-600 dark:text-red-400'
                      : result.feasibility === 'achieved'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {result.requiredAvgGPAOnRemaining.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng tín chỉ plan</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.planTotalCredits}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Quality Points cần đạt
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.planTotalQualityPoints.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded bg-white dark:bg-gray-700">
              <strong className="text-gray-800 dark:text-gray-200">{result.message}</strong>
            </div>
          </div>

          {result.feasibility === 'impossible' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                ⚠️ {result.message}. Hãy thử:
                <ul className="list-disc list-inside mt-2">
                  <li>Tăng số tín chỉ trong plan</li>
                  <li>Tăng baseline GPA</li>
                  <li>Giảm target GPA</li>
                </ul>
              </p>
            </div>
          )}

          {result.plan.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Kế hoạch đăng ký ({result.plan.length} môn)
                </h3>
                <button
                  onClick={handleApplyPlan}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Áp dụng vào Planned Courses
                </button>
              </div>

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
                        Độ khó
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                        GPA cần đạt
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                        Điểm chữ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                        Điểm hệ 10 (khoảng)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {result.plan.map((rec) => (
                      <tr key={rec.courseCode} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100">
                          {rec.courseCode}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                          {rec.courseName}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                          {rec.credits}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-900 dark:text-gray-100">{rec.difficulty}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded ${
                                    level <= rec.difficulty
                                      ? 'bg-red-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {rec.suggestedGPA4.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              rec.suggestedLetter === 'A'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : rec.suggestedLetter === 'B+' || rec.suggestedLetter === 'B'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : rec.suggestedLetter === 'C+' || rec.suggestedLetter === 'C'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {rec.suggestedLetter}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                          {rec.suggestedScore10Range.min.toFixed(1)} -{' '}
                          {rec.suggestedScore10Range.max.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ⚠️ <strong>Lưu ý:</strong> Đây là gợi ý toán học dựa trên công thức GPA. Kết quả thực
              tế có thể khác do tỷ lệ đánh giá từng môn học. Hãy tham khảo và điều chỉnh phù hợp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

