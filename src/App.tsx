import { useState, useEffect } from 'react';
import { Course, CurriculumCourse, RecommendedCourse } from './types';
import { loadCoursesFromStorage, saveCoursesToStorage } from './utils/storage';
import { loadCurriculumFromStorage } from './utils/curriculum';
import { matchCourseToCurriculum } from './utils/curriculum';
import CourseForm from './components/CourseForm';
import CourseTable from './components/CourseTable';
import CourseTableGroupedBySemester from './components/CourseTableGroupedBySemester';
import Dashboard from './components/Dashboard';
import TargetGPACalculator from './components/TargetGPACalculator';
import PlanningTool from './components/PlanningTool';
import ImportExport from './components/ImportExport';
import CurriculumManager from './components/CurriculumManager';
import RecommendationEngine from './components/RecommendationEngine';
import HelpGuide from './components/HelpGuide';

type Tab = 'dashboard' | 'courses' | 'curriculum' | 'target' | 'planning' | 'import-export' | 'help';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumCourse[]>(() => loadCurriculumFromStorage());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gpa-calculator-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [targetGPA, setTargetGPA] = useState('');
  const [totalProgramCredits, setTotalProgramCredits] = useState('');

  // Load courses from localStorage on mount
  useEffect(() => {
    const loaded = loadCoursesFromStorage();
    setCourses(loaded);
  }, []);

  // Auto-save to localStorage whenever courses change
  useEffect(() => {
    saveCoursesToStorage(courses);
  }, [courses]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gpa-calculator-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
    // Try to match with curriculum
    const matched = matchCourseToCurriculum(
      { ...courseData, id: '', courseCode: courseData.courseCode },
      curriculum
    );

    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      courseCode: matched?.courseCode || courseData.courseCode,
      status: courseData.score10 >= 4.0 ? 'passed' : 'failed'
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa môn học này?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleDuplicateCourse = (course: Course) => {
    const duplicated: Course = {
      ...course,
      id: generateId(),
      courseName: `${course.courseName} (Copy)`
    };
    setCourses([...courses, duplicated]);
  };

  const handleAddPlanned = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      isPlanned: true
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdatePlanned = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeletePlanned = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa môn học dự kiến này?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleDuplicatePlanned = (course: Course) => {
    const duplicated: Course = {
      ...course,
      id: generateId(),
      courseName: `${course.courseName} (Copy)`
    };
    setCourses([...courses, duplicated]);
  };

  const handleImport = (importedCourses: Course[]) => {
    // Merge with existing courses, avoiding duplicates
    const existingIds = new Set(courses.map(c => c.id));
    const newCourses = importedCourses.map(c => ({
      ...c,
      id: existingIds.has(c.id) ? generateId() : c.id
    }));
    setCourses([...courses, ...newCourses]);
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn xóa TẤT CẢ dữ liệu? Hành động này không thể hoàn tác!')) {
      setCourses([]);
      localStorage.removeItem('gpa-calculator-courses');
    }
  };

  const handleApplyPlan = (recommendedCourses: RecommendedCourse[]) => {
    const newPlannedCourses: Course[] = recommendedCourses.map(rec => ({
      id: generateId(),
      courseName: rec.courseName,
      courseCode: rec.courseCode,
      credits: rec.credits,
      score10: (rec.suggestedScore10Range.min + rec.suggestedScore10Range.max) / 2,
      isPlanned: true,
      status: 'in_progress'
    }));
    setCourses([...courses, ...newPlannedCourses]);
  };

  const handleCurriculumChange = (newCurriculum: CurriculumCourse[]) => {
    setCurriculum(newCurriculum);
    // Auto-calculate total credits if not set
    if (!totalProgramCredits) {
      const total = newCurriculum.reduce((sum, c) => sum + c.credits, 0);
      if (total > 0) {
        setTotalProgramCredits(total.toString());
      }
    }
  };

  const completedCourses = courses.filter(c => !c.isPlanned);
  const semesters: string[] = Array.from(
    new Set(
      completedCourses
        .map(c => c.semester)
        .filter((s): s is string => s !== undefined && s !== null && s !== '')
    )
  );
  const filteredCourses =
    selectedSemester === 'all'
      ? completedCourses
      : completedCourses.filter(c => c.semester === selectedSemester);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'Danh sách môn', icon: '📚' },
    { id: 'curriculum', label: 'Chương trình học', icon: '📖' },
    { id: 'target', label: 'GPA mục tiêu', icon: '🎯' },
    { id: 'planning', label: 'Planning', icon: '📅' },
    { id: 'import-export', label: 'Import/Export', icon: '💾' },
    { id: 'help', label: 'Hướng dẫn', icon: '❓' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                🎓 GPA Calculator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tính điểm đại học theo thang 4.0
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Dashboard courses={courses} />
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Quản lý môn học
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Chế độ xem:</label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'grouped' | 'flat')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="grouped">Theo kỳ học</option>
                    <option value="flat">Tất cả</option>
                  </select>
                </div>
                {viewMode === 'flat' && semesters.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Lọc theo kỳ:</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    >
                      <option value="all">Tất cả</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <CourseForm
              onAdd={handleAddCourse}
              semesters={semesters}
            />

            {viewMode === 'grouped' ? (
              <CourseTableGroupedBySemester
                courses={courses}
                onUpdate={handleUpdateCourse}
                onDelete={handleDeleteCourse}
                onDuplicate={handleDuplicateCourse}
              />
            ) : (
              <CourseTable
                courses={filteredCourses}
                onUpdate={handleUpdateCourse}
                onDelete={handleDeleteCourse}
                onDuplicate={handleDuplicateCourse}
              />
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Click vào icon ✏️ để sửa inline, 📋 để nhân đôi, 🗑️ để
                xóa môn học. Ở chế độ "Theo kỳ học", click vào header kỳ để thu gọn/mở rộng.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <CurriculumManager onCurriculumChange={handleCurriculumChange} />
          </div>
        )}

        {activeTab === 'target' && (
          <div className="space-y-6">
            <TargetGPACalculator
              courses={courses}
              onTargetChange={(target, total) => {
                setTargetGPA(target);
                setTotalProgramCredits(total);
              }}
            />
            {targetGPA && totalProgramCredits && curriculum.length > 0 && (
              <RecommendationEngine
                curriculum={curriculum}
                courses={courses}
                targetGPA={parseFloat(targetGPA)}
                totalProgramCredits={parseFloat(totalProgramCredits)}
                onApplyPlan={handleApplyPlan}
              />
            )}
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="space-y-6">
            <PlanningTool
              courses={courses}
              onAddPlanned={handleAddPlanned}
              onUpdatePlanned={handleUpdatePlanned}
              onDeletePlanned={handleDeletePlanned}
              onDuplicatePlanned={handleDuplicatePlanned}
            />
          </div>
        )}

        {activeTab === 'import-export' && (
          <div className="space-y-6">
            <ImportExport courses={courses} onImport={handleImport} />
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-6">
            <HelpGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            GPA Calculator - Tính điểm đại học theo thang 4.0 | Dữ liệu được lưu tự động trong
            trình duyệt
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

