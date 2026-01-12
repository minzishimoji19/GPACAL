import { Course } from '../types';

const STORAGE_KEY = 'gpa-calculator-courses';

export function loadCoursesFromStorage(): Course[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading courses from storage:', error);
    return [];
  }
}

export function saveCoursesToStorage(courses: Course[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses to storage:', error);
  }
}

export function exportToJSON(courses: Course[]): string {
  return JSON.stringify(courses, null, 2);
}

export function importFromJSON(jsonString: string): Course[] {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function exportToCSV(courses: Course[]): string {
  const headers = ['courseName', 'credits', 'score10', 'semester'];
  const rows = courses.map(course => [
    course.courseName,
    course.credits.toString(),
    course.score10.toString(),
    course.semester || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function importFromCSV(csvString: string): Course[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const courses: Course[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length < 3) continue;

    const courseNameIndex = headers.indexOf('courseName');
    const creditsIndex = headers.indexOf('credits');
    const score10Index = headers.indexOf('score10');
    const semesterIndex = headers.indexOf('semester');

    if (courseNameIndex === -1 || creditsIndex === -1 || score10Index === -1) continue;

    const course: Course = {
      id: `${Date.now()}-${i}`,
      courseName: values[courseNameIndex] || '',
      credits: parseFloat(values[creditsIndex]) || 0,
      score10: parseFloat(values[score10Index]) || 0,
      semester: semesterIndex !== -1 ? values[semesterIndex] : undefined
    };

    if (course.courseName && course.credits > 0 && course.score10 >= 0) {
      courses.push(course);
    }
  }

  return courses;
}

