require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Question = require('../models/Question');
const PracticeQuestion = require('../models/PracticeQuestion');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Subject.deleteMany({}),
      Question.deleteMany({}),
      PracticeQuestion.deleteMany({})
    ]);
    console.log('Cleared existing data...');

    // Create admin user
    const admin = await User.create({
      name: 'Department Admin',
      email: process.env.ADMIN_EMAIL || 'admin@dept.edu',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin'
    });
    console.log('✅ Admin user created:', admin.email);

    // Create subjects
    const subjectsData = [
      { name: 'Data Structures & Algorithms', code: 'DSA', semester: 1, icon: '🌲', color: '#10b981', description: 'Fundamental data structures and algorithmic thinking', syllabus: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Binary Trees', 'Graphs', 'Sorting Algorithms', 'Searching Algorithms', 'Hash Tables', 'Dynamic Programming', 'Greedy Algorithms'] },
      { name: 'Object Oriented Programming', code: 'OOP', semester: 1, icon: '⚙️', color: '#6366f1', description: 'OOP concepts using Java/C++', syllabus: ['Classes & Objects', 'Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction', 'Interfaces', 'Exception Handling', 'File I/O', 'Collections Framework', 'Design Patterns'] },
      { name: 'Electrical Engineering Essentials', code: 'EEE', semester: 1, icon: '⚡', color: '#f59e0b', description: 'Basic electrical circuits and electronics', syllabus: ['Ohms Law', 'Kirchhoffs Laws', 'AC/DC Circuits', 'Resistors, Capacitors, Inductors', 'Thevenins Theorem', 'Norton\'s Theorem', 'Operational Amplifiers', 'Semiconductors', 'Logic Gates', 'Digital Electronics'] },
      { name: 'Mathematics I', code: 'MATH', semester: 1, icon: '∑', color: '#ec4899', description: 'Calculus, Linear Algebra, and Discrete Mathematics', syllabus: ['Limits & Continuity', 'Differentiation', 'Integration', 'Differential Equations', 'Matrix Algebra', 'Determinants', 'Eigenvalues', 'Vector Spaces', 'Set Theory', 'Combinatorics'] },
      { name: 'Physics I', code: 'PHYSICS', semester: 1, icon: '🔭', color: '#14b8a6', description: 'Mechanics, Waves, and Thermodynamics', syllabus: ['Kinematics', 'Newtons Laws', 'Work & Energy', 'Momentum', 'Circular Motion', 'Oscillations', 'Wave Motion', 'Sound', 'Thermodynamics', 'Heat Transfer'] }
    ];

    const subjects = await Subject.insertMany(subjectsData);
    console.log('✅ Subjects created:', subjects.length);

    const subjectMap = {};
    subjects.forEach(s => { subjectMap[s.code] = s._id; });

    // Sample questions
    const questionsData = [
      // DSA Questions
      { subject: subjectMap['DSA'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Explain the concept of time complexity. What is the time complexity of binary search? Justify your answer.', marks: 10, difficulty: 'medium', tags: ['time complexity', 'binary search', 'analysis'], createdBy: admin._id },
      { subject: subjectMap['DSA'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q2', questionText: 'Write an algorithm to reverse a linked list. Analyze the time and space complexity of your algorithm.', marks: 15, difficulty: 'medium', tags: ['linked list', 'reversal', 'algorithm'], createdBy: admin._id },
      { subject: subjectMap['DSA'], examType: 'CT2', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Compare AVL trees and Red-Black trees. When would you prefer one over the other? Provide examples.', marks: 15, difficulty: 'hard', tags: ['AVL tree', 'red-black tree', 'comparison'], createdBy: admin._id },
      { subject: subjectMap['DSA'], examType: 'CT1', year: 2024, semester: 1, questionNumber: 'Q1', questionText: 'Implement a stack using two queues. Write the push and pop operations with complete code.', marks: 20, difficulty: 'hard', tags: ['stack', 'queue', 'implementation'], createdBy: admin._id },
      { subject: subjectMap['DSA'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Explain Dijkstra\'s shortest path algorithm with a worked example on a weighted directed graph of at least 5 nodes.', marks: 20, difficulty: 'hard', tags: ['graph', 'dijkstra', 'shortest path'], createdBy: admin._id },
      { subject: subjectMap['DSA'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q2', questionText: 'What is dynamic programming? Solve the 0/1 Knapsack problem using dynamic programming with table illustration.', marks: 25, difficulty: 'hard', tags: ['dynamic programming', 'knapsack'], createdBy: admin._id },

      // OOP Questions
      { subject: subjectMap['OOP'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'What is the difference between abstraction and encapsulation? Give real-world examples for each with code snippets.', marks: 10, difficulty: 'easy', tags: ['abstraction', 'encapsulation', 'OOP concepts'], createdBy: admin._id },
      { subject: subjectMap['OOP'], examType: 'CT1', year: 2024, semester: 1, questionNumber: 'Q1', questionText: 'Explain method overloading vs method overriding with examples. What is runtime polymorphism?', marks: 15, difficulty: 'medium', tags: ['polymorphism', 'overloading', 'overriding'], createdBy: admin._id },
      { subject: subjectMap['OOP'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Design a class hierarchy for a University Management System. Include Student, Teacher, Course, and Department classes with appropriate relationships, attributes, and methods.', marks: 30, difficulty: 'hard', tags: ['class design', 'inheritance', 'UML'], createdBy: admin._id },

      // MATH Questions
      { subject: subjectMap['MATH'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Find the derivative of f(x) = x³sin(x) + e^(2x)cos(x) using the product rule and chain rule.', marks: 10, difficulty: 'medium', tags: ['differentiation', 'chain rule', 'product rule'], createdBy: admin._id, hasFormula: true, formula: 'f(x) = x^3\\sin(x) + e^{2x}\\cos(x)' },
      { subject: subjectMap['MATH'], examType: 'CT2', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Find the eigenvalues and eigenvectors of the matrix A = [[4, 1], [2, 3]]. Interpret their geometric meaning.', marks: 15, difficulty: 'hard', tags: ['eigenvalues', 'eigenvectors', 'matrix'], createdBy: admin._id, hasFormula: true },
      { subject: subjectMap['MATH'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Evaluate the double integral ∬_R (x² + y²) dA where R is the region bounded by x² + y² ≤ 4 using polar coordinates.', marks: 20, difficulty: 'hard', tags: ['integration', 'double integral', 'polar coordinates'], createdBy: admin._id, hasFormula: true },

      // PHYSICS Questions  
      { subject: subjectMap['PHYSICS'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'A projectile is launched at 45° with initial velocity 50 m/s. Calculate: (a) maximum height, (b) range, (c) time of flight.', marks: 15, difficulty: 'medium', tags: ['projectile motion', 'kinematics'], createdBy: admin._id },
      { subject: subjectMap['PHYSICS'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'State and prove the work-energy theorem. How does it apply to conservative and non-conservative forces? Provide numerical examples.', marks: 20, difficulty: 'medium', tags: ['work-energy', 'theorem', 'energy'], createdBy: admin._id },

      // EEE Questions
      { subject: subjectMap['EEE'], examType: 'CT1', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Using Kirchhoff\'s Current and Voltage Laws, find the current through each branch of a circuit with 3 loops.', marks: 15, difficulty: 'medium', tags: ['KCL', 'KVL', 'circuit analysis'], createdBy: admin._id },
      { subject: subjectMap['EEE'], examType: 'FINAL', year: 2023, semester: 1, questionNumber: 'Q1', questionText: 'Explain Thevenin\'s theorem. Find the Thevenin equivalent circuit for a given network and calculate the current through a load resistance.', marks: 20, difficulty: 'hard', tags: ['Thevenin', 'equivalent circuit'], createdBy: admin._id },
    ];

    await Question.insertMany(questionsData);
    console.log('✅ Questions created:', questionsData.length);

    // Sample practice questions (MCQ + SHORT)
    const practiceData = [
      // DSA MCQ
      { subject: subjectMap['DSA'], type: 'MCQ', questionText: 'What is the time complexity of inserting an element at the beginning of a singly linked list?', options: [{ label: 'A', text: 'O(n)' }, { label: 'B', text: 'O(1)' }, { label: 'C', text: 'O(log n)' }, { label: 'D', text: 'O(n²)' }], correctAnswer: 'B', explanation: 'Inserting at the head of a linked list only requires updating the head pointer, which is O(1).', topic: 'Linked Lists', difficulty: 'easy', marks: 2, tags: ['linked list', 'time complexity'], createdBy: admin._id },
      { subject: subjectMap['DSA'], type: 'MCQ', questionText: 'Which data structure uses LIFO (Last In, First Out) principle?', options: [{ label: 'A', text: 'Queue' }, { label: 'B', text: 'Heap' }, { label: 'C', text: 'Stack' }, { label: 'D', text: 'Deque' }], correctAnswer: 'C', explanation: 'A Stack follows Last In, First Out — the last element pushed is the first to be popped.', topic: 'Stacks & Queues', difficulty: 'easy', marks: 2, tags: ['stack', 'LIFO'], createdBy: admin._id },
      { subject: subjectMap['DSA'], type: 'MCQ', questionText: 'The worst-case time complexity of QuickSort is:', options: [{ label: 'A', text: 'O(n log n)' }, { label: 'B', text: 'O(n)' }, { label: 'C', text: 'O(n²)' }, { label: 'D', text: 'O(log n)' }], correctAnswer: 'C', explanation: 'QuickSort worst case is O(n²) when the pivot always picks the smallest or largest element.', topic: 'Sorting Algorithms', difficulty: 'medium', marks: 2, tags: ['quicksort', 'time complexity'], createdBy: admin._id },
      { subject: subjectMap['DSA'], type: 'SHORT', questionText: 'Explain the difference between a depth-first search (DFS) and breadth-first search (BFS). When would you use each?', correctAnswer: 'DFS uses a stack (or recursion) and explores as deep as possible before backtracking. BFS uses a queue and explores level by level. Use DFS for pathfinding in mazes, topological sort, cycle detection. Use BFS for shortest path in unweighted graphs, level-order traversal.', topic: 'Graphs', difficulty: 'medium', marks: 5, tags: ['DFS', 'BFS', 'graph traversal'], createdBy: admin._id },
      { subject: subjectMap['DSA'], type: 'PROBLEM', questionText: 'Given an array of integers [3, 1, 4, 1, 5, 9, 2, 6, 5], write the steps of Merge Sort and show the final sorted array.', correctAnswer: 'Split: [3,1,4,1,5] and [9,2,6,5] → recursively split → merge sorted halves. Final: [1, 1, 2, 3, 4, 5, 5, 6, 9]', explanation: 'Merge sort divides array in half, sorts each half recursively, then merges.', topic: 'Sorting Algorithms', difficulty: 'medium', marks: 10, tags: ['merge sort', 'sorting'], createdBy: admin._id },

      // OOP MCQ
      { subject: subjectMap['OOP'], type: 'MCQ', questionText: 'Which OOP concept hides the internal implementation details from the user?', options: [{ label: 'A', text: 'Inheritance' }, { label: 'B', text: 'Polymorphism' }, { label: 'C', text: 'Encapsulation' }, { label: 'D', text: 'Abstraction' }], correctAnswer: 'C', explanation: 'Encapsulation bundles data and methods together and restricts direct access to internal state.', topic: 'Encapsulation', difficulty: 'easy', marks: 2, tags: ['encapsulation', 'OOP'], createdBy: admin._id },
      { subject: subjectMap['OOP'], type: 'MCQ', questionText: 'What keyword is used in Java to inherit from a parent class?', options: [{ label: 'A', text: 'implements' }, { label: 'B', text: 'extends' }, { label: 'C', text: 'inherits' }, { label: 'D', text: 'super' }], correctAnswer: 'B', explanation: 'In Java, the "extends" keyword is used to inherit from a parent/super class.', topic: 'Inheritance', difficulty: 'easy', marks: 2, tags: ['inheritance', 'Java', 'syntax'], createdBy: admin._id },

      // MATH MCQ
      { subject: subjectMap['MATH'], type: 'MCQ', questionText: 'The derivative of sin(x) is:', options: [{ label: 'A', text: '-sin(x)' }, { label: 'B', text: 'cos(x)' }, { label: 'C', text: '-cos(x)' }, { label: 'D', text: 'tan(x)' }], correctAnswer: 'B', explanation: 'd/dx[sin(x)] = cos(x). This is a fundamental trigonometric derivative.', topic: 'Differentiation', difficulty: 'easy', marks: 2, tags: ['differentiation', 'trigonometry'], createdBy: admin._id },
      { subject: subjectMap['MATH'], type: 'MCQ', questionText: 'The determinant of a 2×2 matrix [[a,b],[c,d]] is:', options: [{ label: 'A', text: 'ac - bd' }, { label: 'B', text: 'ad + bc' }, { label: 'C', text: 'ad - bc' }, { label: 'D', text: 'ab - cd' }], correctAnswer: 'C', explanation: 'For a 2×2 matrix, det = (a×d) - (b×c).', topic: 'Matrix Algebra', difficulty: 'easy', marks: 2, tags: ['matrix', 'determinant'], createdBy: admin._id },

      // PHYSICS MCQ
      { subject: subjectMap['PHYSICS'], type: 'MCQ', questionText: 'A ball is dropped from height h. Its velocity just before hitting the ground is:', options: [{ label: 'A', text: '√(gh)' }, { label: 'B', text: '√(2gh)' }, { label: 'C', text: '2gh' }, { label: 'D', text: 'gh' }], correctAnswer: 'B', explanation: 'Using v² = u² + 2as with u=0, a=g, s=h → v = √(2gh)', topic: 'Kinematics', difficulty: 'easy', marks: 2, tags: ['kinematics', 'free fall'], createdBy: admin._id },

      // EEE MCQ
      { subject: subjectMap['EEE'], type: 'MCQ', questionText: 'Ohm\'s Law states that V = IR. If voltage doubles while resistance stays constant, current:', options: [{ label: 'A', text: 'Stays the same' }, { label: 'B', text: 'Halves' }, { label: 'C', text: 'Doubles' }, { label: 'D', text: 'Quadruples' }], correctAnswer: 'C', explanation: 'I = V/R. If V doubles and R is constant, I also doubles.', topic: 'Ohms Law', difficulty: 'easy', marks: 2, tags: ['Ohms Law', 'current', 'voltage'], createdBy: admin._id },
    ];

    await PracticeQuestion.insertMany(practiceData);
    console.log('✅ Practice questions created:', practiceData.length);

    console.log('\n🎉 Seed complete!');
    console.log('Admin credentials:');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@dept.edu'}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
