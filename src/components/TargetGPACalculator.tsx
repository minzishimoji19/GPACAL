import { useState } from 'react';
import { Course } from '../types';
import { calculateRequiredGPAForTarget } from '../utils/gpa';

interface TargetGPACalculatorProps {
  courses: Course[];
  onTargetChange?: (targetGPA: string, totalCredits: string) => void;
}

const TARGET_PRESETS = [3.2, 3.4, 3.6, 3.8];

export default function TargetGPACalculator({ courses, onTargetChange }: TargetGPACalculatorProps) {
  const [targetGPA, setTargetGPA] = useState('');
  const [totalProgramCredits, setTotalProgramCredits] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateRequiredGPAForTarget> | null>(
    null
  );

  const handleCalculate = () => {
    const target = parseFloat(targetGPA);
    const total = parseFloat(totalProgramCredits);

    if (isNaN(target) || target < 0 || target > 4.0) {
      alert('GPA mục tiêu phải là số từ 0 đến 4.0');
      return;
    }

    if (isNaN(total) || total <= 0) {
      alert('Tổng tín chỉ chương trình phải là số dương');
      return;
    }

    const calcResult = calculateRequiredGPAForTarget(courses, target, total);
    setResult(calcResult);
    onTargetChange?.(targetGPA, totalProgramCredits);
  };

  const handlePreset = (preset: number) => {
    setTargetGPA(preset.toString());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Công cụ GPA mục tiêu
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GPA mục tiêu (0-4.0)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="VD: 3.2"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Presets:</span>
            {TARGET_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tổng tín chỉ chương trình
          </label>
          <input
            type="number"
            min="1"
            value={totalProgramCredits}
            onChange={(e) => setTotalProgramCredits(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder="VD: 120, 130, 150"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tổng số tín chỉ của toàn bộ chương trình đào tạo
          </p>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tính toán
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg border-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Kết quả
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Tín chỉ còn lại: </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {result.remainingCredits}
              </span>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400">GPA cần đạt: </span>
              <span
                className={`font-bold text-lg ${
                  result.isFeasible && result.requiredGPA > 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {result.requiredGPA.toFixed(2)}
              </span>
            </div>

            <div
              className={`p-3 rounded ${
                !result.isFeasible
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : result.requiredGPA <= 0
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}
            >
              <strong>{result.message}</strong>
            </div>

            {result.isFeasible && result.requiredGPA > 0 && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Công thức:</strong>
                  <br />
                  Required GPA = (Target GPA × Total Credits - Current Quality Points) / Remaining
                  Credits
                  <br />
                  <br />
                  = ({parseFloat(targetGPA)} × {parseFloat(totalProgramCredits)} -{' '}
                  {(
                    parseFloat(targetGPA) * parseFloat(totalProgramCredits) -
                    result.requiredGPA * result.remainingCredits
                  ).toFixed(2)}{' '}
                  ) / {result.remainingCredits}
                  <br />
                  = {result.requiredGPA.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

