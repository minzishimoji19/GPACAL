import { CurriculumCourse, Course } from '../types';
import { score10ToGPA4 } from './gpa';

const STORAGE_KEY = 'gpa-calculator-curriculum';

/**
 * Load curriculum from localStorage
 */
export function loadCurriculumFromStorage(): CurriculumCourse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading curriculum from storage:', error);
    return [];
  }
}

/**
 * Save curriculum to localStorage
 */
export function saveCurriculumToStorage(curriculum: CurriculumCourse[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculum));
  } catch (error) {
    console.error('Error saving curriculum to storage:', error);
  }
}

/**
 * Normalize course name for matching
 */
export function normalizeCourseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match course with curriculum by courseCode or normalized name
 */
export function matchCourseToCurriculum(
  course: Course,
  curriculum: CurriculumCourse[]
): CurriculumCourse | null {
  // Try matching by courseCode first
  if (course.courseCode) {
    const match = curriculum.find(c => c.courseCode === course.courseCode);
    if (match) return match;
  }

  // Try matching by normalized name
  const normalizedCourseName = normalizeCourseName(course.courseName);
  for (const currCourse of curriculum) {
    const normalizedCurrName = normalizeCourseName(currCourse.courseName);
    if (normalizedCurrName === normalizedCourseName) {
      return currCourse;
    }
  }

  return null;
}

/**
 * Get remaining courses (not passed yet)
 */
export function getRemainingCourses(
  curriculum: CurriculumCourse[],
  completedCourses: Course[]
): CurriculumCourse[] {
  const passedCourseCodes = new Set<string>();
  const passedCourseNames = new Set<string>();

  completedCourses
    .filter(c => c.status === 'passed' || (!c.status && c.score10 >= 4.0))
    .forEach(course => {
      if (course.courseCode) {
        passedCourseCodes.add(course.courseCode);
      }
      passedCourseNames.add(normalizeCourseName(course.courseName));
    });

  return curriculum.filter(currCourse => {
    // Check by courseCode
    if (passedCourseCodes.has(currCourse.courseCode)) {
      return false;
    }

    // Check by normalized name
    const normalizedName = normalizeCourseName(currCourse.courseName);
    return !passedCourseNames.has(normalizedName);
  });
}

/**
 * Parse curriculum from CSV/TSV text
 */
export function parseCurriculumFromText(text: string): CurriculumCourse[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(/\t|,/).map(h => h.trim().toLowerCase());
  const courses: CurriculumCourse[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/\t|,/).map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length < 3) continue;

    const courseCodeIndex = headers.findIndex(h => h.includes('code') || h.includes('mã'));
    const courseNameIndex = headers.findIndex(h => h.includes('name') || h.includes('tên'));
    const creditsIndex = headers.findIndex(h => h.includes('credit') || h.includes('tín'));
    const semesterIndex = headers.findIndex(h => h.includes('semester') || h.includes('kỳ'));
    const categoryIndex = headers.findIndex(h => h.includes('category') || h.includes('loại'));
    const difficultyIndex = headers.findIndex(h => h.includes('difficulty') || h.includes('độ khó'));

    if (courseCodeIndex === -1 || courseNameIndex === -1 || creditsIndex === -1) continue;

    const course: CurriculumCourse = {
      courseCode: values[courseCodeIndex] || `COURSE_${i}`,
      courseName: values[courseNameIndex] || '',
      credits: parseFloat(values[creditsIndex]) || 0,
      recommendedSemester: semesterIndex !== -1 ? values[semesterIndex] : undefined,
      category: categoryIndex !== -1 ? (values[categoryIndex] as any) : undefined,
      difficulty: difficultyIndex !== -1 ? parseInt(values[difficultyIndex]) || 3 : 3
    };

    if (course.courseName && course.credits > 0) {
      courses.push(course);
    }
  }

  return courses;
}

/**
 * Export curriculum to CSV
 */
export function exportCurriculumToCSV(curriculum: CurriculumCourse[]): string {
  const headers = ['courseCode', 'courseName', 'credits', 'recommendedSemester', 'category', 'difficulty'];
  const rows = curriculum.map(course => [
    course.courseCode,
    course.courseName,
    course.credits.toString(),
    course.recommendedSemester || '',
    course.category || '',
    (course.difficulty || 3).toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Get default MIS curriculum template (130 credits)
 */
export function getDefaultMISCurriculum(): CurriculumCourse[] {
  return [
    { courseCode: 'MATH101', courseName: 'Toán cao cấp 1', credits: 3, category: 'general', difficulty: 3 },
    { courseCode: 'MATH102', courseName: 'Toán cao cấp 2', credits: 3, category: 'general', difficulty: 3 },
    { courseCode: 'PHYS101', courseName: 'Vật lý đại cương', credits: 3, category: 'general', difficulty: 2 },
    { courseCode: 'ENG101', courseName: 'Tiếng Anh 1', credits: 3, category: 'general', difficulty: 2 },
    { courseCode: 'ENG102', courseName: 'Tiếng Anh 2', credits: 3, category: 'general', difficulty: 2 },
    { courseCode: 'CS101', courseName: 'Nhập môn lập trình', credits: 3, category: 'major', difficulty: 2 },
    { courseCode: 'CS102', courseName: 'Cấu trúc dữ liệu và giải thuật', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'CS201', courseName: 'Lập trình hướng đối tượng', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'CS202', courseName: 'Cơ sở dữ liệu', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'CS203', courseName: 'Mạng máy tính', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS301', courseName: 'Hệ thống thông tin quản lý', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS302', courseName: 'Phân tích và thiết kế hệ thống', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'MIS303', courseName: 'Quản trị dự án CNTT', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS401', courseName: 'Thương mại điện tử', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS402', courseName: 'An ninh thông tin', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'MIS403', courseName: 'Hệ thống ERP', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'MIS404', courseName: 'Phát triển ứng dụng web', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS405', courseName: 'Phát triển ứng dụng di động', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS406', courseName: 'Trí tuệ nhân tạo trong quản trị', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'MIS407', courseName: 'Phân tích dữ liệu lớn', credits: 3, category: 'major', difficulty: 4 },
    { courseCode: 'MIS408', courseName: 'Quản lý hệ thống thông tin', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS409', courseName: 'Đổi mới số', credits: 3, category: 'major', difficulty: 3 },
    { courseCode: 'MIS410', courseName: 'Thực tập tốt nghiệp', credits: 6, category: 'internship', difficulty: 2 },
    { courseCode: 'MIS411', courseName: 'Đồ án tốt nghiệp', credits: 10, category: 'thesis', difficulty: 5 },
    { courseCode: 'ELEC001', courseName: 'Môn tự chọn 1', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'ELEC002', courseName: 'Môn tự chọn 2', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'ELEC003', courseName: 'Môn tự chọn 3', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'ELEC004', courseName: 'Môn tự chọn 4', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'ELEC005', courseName: 'Môn tự chọn 5', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'ELEC006', courseName: 'Môn tự chọn 6', credits: 3, category: 'elective', difficulty: 2 },
    { courseCode: 'GEN001', courseName: 'Giáo dục quốc phòng', credits: 3, category: 'general', difficulty: 1 },
    { courseCode: 'GEN002', courseName: 'Giáo dục thể chất 1', credits: 1, category: 'general', difficulty: 1 },
    { courseCode: 'GEN003', courseName: 'Giáo dục thể chất 2', credits: 1, category: 'general', difficulty: 1 },
    { courseCode: 'GEN004', courseName: 'Kỹ năng mềm', credits: 2, category: 'general', difficulty: 1 },
    { courseCode: 'GEN005', courseName: 'Pháp luật đại cương', credits: 2, category: 'general', difficulty: 2 },
    { courseCode: 'GEN006', courseName: 'Kinh tế học đại cương', credits: 2, category: 'general', difficulty: 2 },
    { courseCode: 'GEN007', courseName: 'Quản trị học', credits: 2, category: 'general', difficulty: 2 },
    { courseCode: 'GEN008', courseName: 'Marketing căn bản', credits: 2, category: 'general', difficulty: 2 },
    { courseCode: 'GEN009', courseName: 'Kế toán tài chính', credits: 3, category: 'general', difficulty: 3 },
    { courseCode: 'GEN010', courseName: 'Tài chính doanh nghiệp', credits: 3, category: 'general', difficulty: 3 }
  ];
}

