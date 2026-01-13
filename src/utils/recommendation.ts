import { CurriculumCourse, RecommendedCourse, RecommendationStrategy, Course } from '../types';
import { score10ToGPA4 } from './gpa';
import { getRemainingCourses } from './curriculum';

export interface RecommendationConfig {
  targetGPA: number;
  totalProgramCredits: number;
  maxCreditsPerTerm: number;
  termCountToPlan: number;
  preferredCategories?: string[];
  allowElectivesOnly?: boolean;
  strategy: RecommendationStrategy;
  baselineGPA: number; // GPA giả định cho các môn ngoài plan
  mode: 'simple' | 'optimized';
}

export interface RecommendationResult {
  requiredAvgGPAOnRemaining: number;
  feasibility: 'impossible' | 'achieved' | 'feasible';
  message: string;
  plan: RecommendedCourse[];
  planTotalCredits: number;
  planTotalQualityPoints: number;
  remainingAfterPlan: number;
}

/**
 * Convert GPA4 to score10 range
 */
export function gpa4ToScore10Range(gpa4: number): { min: number; max: number } {
  if (gpa4 >= 4.0) return { min: 8.5, max: 10.0 };
  if (gpa4 >= 3.5) return { min: 8.0, max: 8.5 };
  if (gpa4 >= 3.0) return { min: 7.0, max: 8.0 };
  if (gpa4 >= 2.5) return { min: 6.5, max: 7.0 };
  if (gpa4 >= 2.0) return { min: 5.5, max: 6.5 };
  if (gpa4 >= 1.5) return { min: 5.0, max: 5.5 };
  if (gpa4 >= 1.0) return { min: 4.0, max: 5.0 };
  return { min: 0, max: 4.0 };
}

/**
 * Calculate required GPA for remaining courses
 */
export function calculateRequiredGPAForRemaining(
  currentQualityPoints: number,
  currentCredits: number,
  targetGPA: number,
  totalProgramCredits: number
): { requiredGPA: number; remainingCredits: number; feasibility: 'impossible' | 'achieved' | 'feasible'; message: string } {
  const remainingCredits = totalProgramCredits - currentCredits;

  if (remainingCredits <= 0) {
    return {
      requiredGPA: 0,
      remainingCredits: 0,
      feasibility: 'achieved',
      message: 'Bạn đã đạt mục tiêu rồi!'
    };
  }

  const requiredQualityPoints = targetGPA * totalProgramCredits - currentQualityPoints;
  const requiredGPA = requiredQualityPoints / remainingCredits;

  if (requiredGPA > 4.0) {
    return {
      requiredGPA: 4.0,
      remainingCredits,
      feasibility: 'impossible',
      message: 'Không khả thi theo thang 4.0'
    };
  }

  if (requiredGPA < 0) {
    return {
      requiredGPA: 0,
      remainingCredits,
      feasibility: 'achieved',
      message: 'Bạn đã đạt mục tiêu rồi!'
    };
  }

  return {
    requiredGPA,
    remainingCredits,
    feasibility: 'feasible',
    message: `Cần đạt GPA trung bình ${requiredGPA.toFixed(2)} cho ${remainingCredits} tín chỉ còn lại`
  };
}

/**
 * Rank courses by strategy
 */
function rankCoursesByStrategy(
  courses: CurriculumCourse[],
  strategy: RecommendationStrategy
): CurriculumCourse[] {
  const sorted = [...courses];

  switch (strategy) {
    case 'easiest':
      return sorted.sort((a, b) => {
        const diffA = a.difficulty || 3;
        const diffB = b.difficulty || 3;
        if (diffA !== diffB) return diffA - diffB;
        return a.credits - b.credits; // Ưu tiên môn ít tín chỉ trước
      });

    case 'mostImpact':
      return sorted.sort((a, b) => b.credits - a.credits);

    case 'balanced':
      return sorted.sort((a, b) => {
        const scoreA = a.credits * (6 - (a.difficulty || 3));
        const scoreB = b.credits * (6 - (b.difficulty || 3));
        return scoreB - scoreA;
      });

    default:
      return sorted;
  }
}

/**
 * Select courses for plan based on strategy and constraints
 */
function selectCoursesForPlan(
  remainingCourses: CurriculumCourse[],
  config: RecommendationConfig
): CurriculumCourse[] {
  let candidates = [...remainingCourses];

  // Filter by preferred categories
  if (config.preferredCategories && config.preferredCategories.length > 0) {
    candidates = candidates.filter(c => 
      config.preferredCategories!.includes(c.category || 'general')
    );
  }

  // Filter electives only if requested
  if (config.allowElectivesOnly) {
    candidates = candidates.filter(c => c.category === 'elective');
  }

  // Rank by strategy
  const ranked = rankCoursesByStrategy(candidates, config.strategy);

  // Select up to maxCreditsPerTerm * termCountToPlan
  const maxCredits = config.maxCreditsPerTerm * config.termCountToPlan;
  const selected: CurriculumCourse[] = [];
  let totalCredits = 0;

  for (const course of ranked) {
    if (totalCredits + course.credits <= maxCredits) {
      selected.push(course);
      totalCredits += course.credits;
    }
  }

  return selected;
}

/**
 * Simple mode: distribute GPA evenly or with difficulty adjustment
 */
function calculateSimpleModeGPA(
  selectedCourses: CurriculumCourse[],
  requiredAvgGPA: number
): RecommendedCourse[] {
  const recommended: RecommendedCourse[] = [];

  for (const course of selectedCourses) {
    let gpa = requiredAvgGPA;
    const difficulty = course.difficulty || 3;

    // Option B: Adjust based on difficulty
    if (difficulty >= 4) {
      gpa = Math.max(0, requiredAvgGPA - 0.2);
    } else if (difficulty <= 2) {
      gpa = Math.min(4.0, requiredAvgGPA + 0.2);
    }

    // Clamp to valid GPA values
    const validGPAs = [0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
    gpa = validGPAs.reduce((prev, curr) => 
      Math.abs(curr - gpa) < Math.abs(prev - gpa) ? curr : prev
    );

    const { letter } = score10ToGPA4(gpa === 4.0 ? 8.5 : gpa === 3.5 ? 8.0 : gpa === 3.0 ? 7.0 : gpa === 2.5 ? 6.5 : gpa === 2.0 ? 5.5 : gpa === 1.5 ? 5.0 : gpa === 1.0 ? 4.0 : 0);
    const scoreRange = gpa4ToScore10Range(gpa);

    recommended.push({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      difficulty: difficulty,
      suggestedGPA4: gpa,
      suggestedLetter: letter,
      suggestedScore10Range: scoreRange
    });
  }

  return recommended;
}

/**
 * Optimized mode: Greedy algorithm to minimize effort
 */
function calculateOptimizedModeGPA(
  selectedCourses: CurriculumCourse[],
  requiredPlanQualityPoints: number,
  config: RecommendationConfig
): RecommendedCourse[] {
  const recommended: RecommendedCourse[] = [];
  const validGPAs = [0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];

  // Initialize with baseline GPA
  const courseGPAs = new Map<string, number>();
  selectedCourses.forEach(course => {
    const difficulty = course.difficulty || 3;
    const baseline = Math.max(2.0, config.baselineGPA - (difficulty - 3) * 0.2);
    courseGPAs.set(course.courseCode, baseline);
  });

  // Calculate current total quality points
  let currentQualityPoints = selectedCourses.reduce((sum, course) => {
    return sum + (courseGPAs.get(course.courseCode) || 0) * course.credits;
  }, 0);

  // Greedy: increase GPA of easiest + high credit courses first
  const sortedByEase = [...selectedCourses].sort((a, b) => {
    const easeA = a.credits * (6 - (a.difficulty || 3));
    const easeB = b.credits * (6 - (b.difficulty || 3));
    return easeB - easeA;
  });

  for (const course of sortedByEase) {
    if (currentQualityPoints >= requiredPlanQualityPoints) break;

    const currentGPA = courseGPAs.get(course.courseCode) || 0;
    const currentIndex = validGPAs.indexOf(currentGPA);
    
    if (currentIndex < validGPAs.length - 1) {
      const nextGPA = validGPAs[currentIndex + 1];
      const additionalPoints = (nextGPA - currentGPA) * course.credits;
      
      if (currentQualityPoints + additionalPoints <= requiredPlanQualityPoints + 0.1) {
        courseGPAs.set(course.courseCode, nextGPA);
        currentQualityPoints += additionalPoints;
      }
    }
  }

  // Build recommended courses
  for (const course of selectedCourses) {
    const gpa = courseGPAs.get(course.courseCode) || config.baselineGPA;
    const { letter } = score10ToGPA4(gpa === 4.0 ? 8.5 : gpa === 3.5 ? 8.0 : gpa === 3.0 ? 7.0 : gpa === 2.5 ? 6.5 : gpa === 2.0 ? 5.5 : gpa === 1.5 ? 5.0 : gpa === 1.0 ? 4.0 : 0);
    const scoreRange = gpa4ToScore10Range(gpa);

    recommended.push({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      difficulty: course.difficulty || 3,
      suggestedGPA4: gpa,
      suggestedLetter: letter,
      suggestedScore10Range: scoreRange
    });
  }

  return recommended;
}

/**
 * Generate recommendation plan
 */
export function generateRecommendation(
  curriculum: CurriculumCourse[],
  completedCourses: Course[],
  config: RecommendationConfig
): RecommendationResult {
  // Calculate current stats
  const passedCourses = completedCourses.filter(c => 
    c.status === 'passed' || (!c.status && c.score10 >= 4.0)
  );

  const currentQualityPoints = passedCourses.reduce((sum, course) => {
    const { gpa4 } = score10ToGPA4(course.score10);
    return sum + gpa4 * course.credits;
  }, 0);

  const currentCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);

  // Get remaining courses
  const remainingCourses = getRemainingCourses(curriculum, completedCourses);

  // Calculate required GPA for remaining
  const { requiredGPA, remainingCredits, feasibility, message } = 
    calculateRequiredGPAForRemaining(
      currentQualityPoints,
      currentCredits,
      config.targetGPA,
      config.totalProgramCredits
    );

  if (feasibility === 'impossible' || feasibility === 'achieved') {
    return {
      requiredAvgGPAOnRemaining: requiredGPA,
      feasibility,
      message,
      plan: [],
      planTotalCredits: 0,
      planTotalQualityPoints: 0,
      remainingAfterPlan: remainingCredits
    };
  }

  // Select courses for plan
  const selectedCourses = selectCoursesForPlan(remainingCourses, config);
  const planCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const remainingAfterPlan = remainingCredits - planCredits;

  // Calculate required quality points for plan
  const requiredTotalQualityPoints = config.targetGPA * config.totalProgramCredits;
  const remainingAfterPlanQualityPoints = config.baselineGPA * remainingAfterPlan;
  const requiredPlanQualityPoints = requiredTotalQualityPoints - currentQualityPoints - remainingAfterPlanQualityPoints;
  const requiredAvgGPAOnPlan = planCredits > 0 ? requiredPlanQualityPoints / planCredits : 0;

  if (requiredAvgGPAOnPlan > 4.0) {
    return {
      requiredAvgGPAOnRemaining: requiredGPA,
      feasibility: 'impossible',
      message: 'Plan này không đủ tín chỉ hoặc baseline quá thấp. Hãy tăng số tín chỉ plan hoặc baseline.',
      plan: [],
      planTotalCredits: planCredits,
      planTotalQualityPoints: 0,
      remainingAfterPlan
    };
  }

  // Generate recommendations based on mode
  let recommendedCourses: RecommendedCourse[];
  if (config.mode === 'optimized') {
    recommendedCourses = calculateOptimizedModeGPA(selectedCourses, requiredPlanQualityPoints, config);
  } else {
    recommendedCourses = calculateSimpleModeGPA(selectedCourses, requiredAvgGPAOnPlan);
  }

  const planTotalQualityPoints = recommendedCourses.reduce((sum, c) => 
    sum + c.suggestedGPA4 * c.credits, 0
  );

  return {
    requiredAvgGPAOnRemaining: requiredGPA,
    feasibility: 'feasible',
    message,
    plan: recommendedCourses,
    planTotalCredits: planCredits,
    planTotalQualityPoints,
    remainingAfterPlan
  };
}
