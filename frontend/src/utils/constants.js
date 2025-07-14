export const API_BASE_URL = 'https://knowledgesharing-6rhl.onrender.com/api/v1';
//'http://localhost:5000/api/v1';

export const ROLES = {
  TEACHER: 'faculty',
  STUDENT: 'student'
};

export const ACCESS_LEVELS = {
  FACULTY_ONLY: 'facultyOnly',
  ALL_STUDENTS: 'allStudents',
  SPECIFIC_BRANCH_OR_CLASS: 'specificBranchOrClass',
  BOTH: 'both'
};

export const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electronics and Telecommunication Engineering',
  'Computer Science Engineering (AIML)',
  'Computer Engineering Regional',
  'Electronics Engineering'
];

export const CLASSES = [
  'FE', 'SE', 'TE', 'BE'
];