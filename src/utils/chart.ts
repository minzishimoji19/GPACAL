import { Course } from '../types';
import { score10ToGPA4 } from './gpa';

export interface GradeDistribution {
  letter: string;
  credits: number;
  count: number;
}

export function getGradeDistribution(courses: Course[]): GradeDistribution[] {
  const completedCourses = courses.filter(c => !c.isPlanned);
  const distribution: Record<string, { credits: number; count: number }> = {};

  completedCourses.forEach(course => {
    const { letter } = score10ToGPA4(course.score10);
    if (!distribution[letter]) {
      distribution[letter] = { credits: 0, count: 0 };
    }
    distribution[letter].credits += course.credits;
    distribution[letter].count += 1;
  });

  const order = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
  return order
    .filter(letter => distribution[letter])
    .map(letter => ({
      letter,
      credits: distribution[letter].credits,
      count: distribution[letter].count
    }));
}

