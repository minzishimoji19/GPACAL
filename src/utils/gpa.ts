import { Course, GradeInfo } from '../types';

/**
 * Quy đổi điểm hệ 10 sang GPA thang 4.0 và letter grade
 */
export function score10ToGPA4(score10: number): GradeInfo {
  if (score10 >= 8.5) return { gpa4: 4.0, letter: 'A' };
  if (score10 >= 8.0) return { gpa4: 3.5, letter: 'B+' };
  if (score10 >= 7.0) return { gpa4: 3.0, letter: 'B' };
  if (score10 >= 6.5) return { gpa4: 2.5, letter: 'C+' };
  if (score10 >= 5.5) return { gpa4: 2.0, letter: 'C' };
  if (score10 >= 5.0) return { gpa4: 1.5, letter: 'D+' };
  if (score10 >= 4.0) return { gpa4: 1.0, letter: 'D' };
  return { gpa4: 0.0, letter: 'F' };
}

/**
 * Tính GPA tích lũy thang 4.0
 */
export function calculateGPA4(courses: Course[]): number {
  const completedCourses = courses.filter(c => !c.isPlanned);
  if (completedCourses.length === 0) return 0;

  const totalQualityPoints = completedCourses.reduce((sum, course) => {
    const { gpa4 } = score10ToGPA4(course.score10);
    return sum + gpa4 * course.credits;
  }, 0);

  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);

  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

/**
 * Tính GPA thang 10 (weighted average)
 */
export function calculateGPA10(courses: Course[]): number {
  const completedCourses = courses.filter(c => !c.isPlanned);
  if (completedCourses.length === 0) return 0;

  const totalScore = completedCourses.reduce((sum, course) => {
    return sum + course.score10 * course.credits;
  }, 0);

  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);

  return totalCredits > 0 ? totalScore / totalCredits : 0;
}

/**
 * Tính tổng quality points
 */
export function calculateQualityPoints(courses: Course[]): number {
  const completedCourses = courses.filter(c => !c.isPlanned);
  return completedCourses.reduce((sum, course) => {
    const { gpa4 } = score10ToGPA4(course.score10);
    return sum + gpa4 * course.credits;
  }, 0);
}

/**
 * Tính tổng tín chỉ
 */
export function calculateTotalCredits(courses: Course[], includePlanned = false): number {
  const coursesToCount = includePlanned ? courses : courses.filter(c => !c.isPlanned);
  return coursesToCount.reduce((sum, course) => sum + course.credits, 0);
}

/**
 * Tính GPA dự kiến (bao gồm planned courses)
 */
export function calculateProjectedGPA4(courses: Course[]): number {
  if (courses.length === 0) return 0;

  const totalQualityPoints = courses.reduce((sum, course) => {
    const { gpa4 } = score10ToGPA4(course.score10);
    return sum + gpa4 * course.credits;
  }, 0);

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

/**
 * Tính GPA theo kỳ học
 */
export function calculateSemesterGPA4(courses: Course[], semester: string): number {
  const semesterCourses = courses.filter(c => c.semester === semester && !c.isPlanned);
  return calculateGPA4(semesterCourses);
}

export function calculateSemesterGPA10(courses: Course[], semester: string): number {
  const semesterCourses = courses.filter(c => c.semester === semester && !c.isPlanned);
  return calculateGPA10(semesterCourses);
}

export function calculateSemesterCredits(courses: Course[], semester: string): number {
  const semesterCourses = courses.filter(c => c.semester === semester && !c.isPlanned);
  return calculateTotalCredits(semesterCourses);
}

/**
 * Tính GPA mục tiêu cần đạt cho các môn còn lại
 */
export function calculateRequiredGPAForTarget(
  currentCourses: Course[],
  targetGPA: number,
  totalProgramCredits: number
): { requiredGPA: number; remainingCredits: number; isFeasible: boolean; message: string } {
  const currentCredits = calculateTotalCredits(currentCourses);
  const remainingCredits = totalProgramCredits - currentCredits;
  const currentQualityPoints = calculateQualityPoints(currentCourses);

  if (remainingCredits <= 0) {
    return {
      requiredGPA: 0,
      remainingCredits: 0,
      isFeasible: true,
      message: 'Bạn đã đạt mục tiêu rồi!'
    };
  }

  const requiredQualityPoints = targetGPA * totalProgramCredits - currentQualityPoints;
  const requiredGPA = requiredQualityPoints / remainingCredits;

  if (requiredGPA > 4.0) {
    return {
      requiredGPA: 4.0,
      remainingCredits,
      isFeasible: false,
      message: 'Không khả thi theo thang 4.0'
    };
  }

  if (requiredGPA < 0) {
    return {
      requiredGPA: 0,
      remainingCredits,
      isFeasible: true,
      message: 'Bạn đã đạt mục tiêu rồi!'
    };
  }

  return {
    requiredGPA,
    remainingCredits,
    isFeasible: true,
    message: `Cần đạt GPA trung bình ${requiredGPA.toFixed(2)} cho ${remainingCredits} tín chỉ còn lại`
  };
}

