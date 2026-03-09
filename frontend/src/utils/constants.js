export const API_BASE_URL = 'https://edushare-backend-25by.onrender.com/api/v1';
//'https://knowledgesharing-6rhl.onrender.com/api/v1';
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
            'Electrical Engineering',
            'Artificial Intelligence And Machine Learning (AIML)',
            'Civil Engineering',
            'Mechanical Engineering',
            'Electronic and Computer Science Engineering (ECS)',
            'Computer Science Engineering (AIML)',
            'Mechanical and Mechatronics Engineering',
            'Computer Science and Engineering & Artificial Intelligence and Machine Learning',
            'Computers Science Engineering'
];

export const CLASSES = [
  'FE', 'SE', 'TE', 'BE'
];