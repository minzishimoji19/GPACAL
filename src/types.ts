export interface Course {
  id: string;
  courseName: string;
  courseCode?: string; // Mã môn học (để match với curriculum)
  credits: number;
  score10: number;
  semester?: string;
  isPlanned?: boolean;
  status?: 'passed' | 'failed' | 'in_progress';
}

export interface GradeInfo {
  gpa4: number;
  letter: string;
}

export type SortField = 'courseName' | 'credits' | 'score10' | 'semester';
export type SortDirection = 'asc' | 'desc';

export type CourseCategory = 'general' | 'major' | 'elective' | 'internship' | 'thesis';

export interface CurriculumCourse {
  courseCode: string; // Unique identifier
  courseName: string;
  credits: number;
  recommendedSemester?: string;
  prerequisites?: string[];
  category?: CourseCategory;
  difficulty?: number; // 1-5
}

export interface RecommendedCourse {
  courseCode: string;
  courseName: string;
  credits: number;
  difficulty: number;
  suggestedGPA4: number;
  suggestedLetter: string;
  suggestedScore10Range: { min: number; max: number };
}

export type RecommendationStrategy = 'easiest' | 'mostImpact' | 'balanced';

