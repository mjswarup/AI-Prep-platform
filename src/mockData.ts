export interface Company {
  name: string;
  logo: string;
  overview: string;
  salary: string;
  eligibility: string;
  rounds: string[];
  pattern: string;
  topics: string[];
  resources: string[];
}

export const companiesData: Company[] = [
  {
    name: "Amazon",
    logo: "A",
    overview: "Amazon is a global technology powerhouse focusing on e-commerce, cloud computing, digital streaming, and AI. Known for its Leadership Principles and intense technical rounds.",
    salary: "₹18 LPA - ₹45 LPA",
    eligibility: "CGPA > 7.0, No active backlogs",
    rounds: ["Online Assessment (OA) - Aptitude & Coding", "Technical Interview I (DSA & System Design)", "Technical Interview II (System Design & Leadership)", "Bar Raiser Round (Behavioral & Core CS)"],
    pattern: "2 DSA Coding Questions (60m) + Work Style Simulation (20m) + Aptitude (20m)",
    topics: ["Trees and Graphs", "Dynamic Programming", "System Design", "Leadership Principles", "Object Oriented Design"],
    resources: ["LeetCode Top Amazon Questions", "Grokking the System Design Interview", "Amazon Leadership Principles Guide"]
  },
  {
    name: "Google",
    logo: "G",
    overview: "Google is a world-class technology company specializing in search engines, online advertising, cloud computing, software, and hardware. Interviews focus heavily on clean coding, data structures, and algorithms.",
    salary: "₹25 LPA - ₹60 LPA",
    eligibility: "CGPA > 8.0, Excellent problem-solving skills",
    rounds: ["Phone Screen (Coding & Complex Math)", "Technical Onsite 1 (Advanced DSA)", "Technical Onsite 2 (System Design/Algorithms)", "Technical Onsite 3 (Googlyness & Leadership)"],
    pattern: "45-minute coding rounds on Google Docs/Chromebook editor. No compiling allowed during interviews.",
    topics: ["Graph Algorithms (Dijkstra, A*)", "Dynamic Programming", "Recursion & Backtracking", "Advanced Data Structures (Segment Trees, Trie)", "Concurrency"],
    resources: ["LeetCode Google Card", "Tech Dev Guide by Google", "Cracking the Coding Interview"]
  },
  {
    name: "TCS",
    logo: "T",
    overview: "Tata Consultancy Services (TCS) is one of the largest IT service companies globally. Recruitment happens primarily through TCS NQT (National Qualifier Test) for Ninja and Digital roles.",
    salary: "₹3.36 LPA (Ninja) - ₹7.0 LPA (Digital)",
    eligibility: "60% or 6.0 CGPA throughout 10th, 12th, and UG",
    rounds: ["NQT Online Test (Cognitive & Coding)", "Technical Interview", "HR & Managerial Interview"],
    pattern: "80 Questions (Aptitude, Reasoning, Verbal) + 2 Coding Questions (90m total)",
    topics: ["Quantitative Aptitude (Percentages, Time & Work)", "Pseudocode debugging", "Basic DSA (Arrays, Strings)", "DBMS & SQL Concepts"],
    resources: ["TCS NQT Preparation Kit", "GeeksforGeeks TCS Placement Papers", "Aptitude by RS Aggarwal"]
  },
  {
    name: "Accenture",
    logo: "Ac",
    overview: "Accenture is a multinational professional services company providing services in strategy, consulting, digital, technology, and operations.",
    salary: "₹4.5 LPA (ASE) - ₹6.5 LPA (FSE)",
    eligibility: "65% or 6.5 CGPA, Max 1 year gap in education",
    rounds: ["Cognitive & Technical Assessment", "Coding Assessment", "Communication Assessment", "Technical & HR Interview"],
    pattern: "90 Questions (Cognitive + Technical) + 2 Coding Questions (45m)",
    topics: ["Analytical Reasoning", "MS Office & Cloud Fundamentals", "Pseudocoding", "Networking & Security"],
    resources: ["Accenture Mock Papers", "Communication Test Guidelines", "Basic Java/Python concepts"]
  },
  {
    name: "Microsoft",
    logo: "M",
    overview: "Microsoft is a global leader in software, consumer electronics, and personal computers. Interviews assess system design, OOPs, and algorithmic efficiency.",
    salary: "₹20 LPA - ₹50 LPA",
    eligibility: "CGPA > 7.5, Strong CS Fundamentals",
    rounds: ["Online Coding Test", "Technical Interview I (DSA)", "Technical Interview II (System Design)", "Asst. Director/AA Round (Design & Culture Fit)"],
    pattern: "3 Coding Questions (90m) + 3 Technical Rounds",
    topics: ["Linked Lists & Arrays", "System Design", "Operating Systems & Networking", "OOP Concepts"],
    resources: ["Microsoft Interview Roadmap", "System Design Primer", "LeetCode Microsoft Top Questions"]
  }
];

export interface CRTQuestion {
  id: number;
  category: "Quantitative" | "Logical" | "Verbal" | "Debugging" | "Puzzles";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const crtQuestions: CRTQuestion[] = [
  {
    id: 1,
    category: "Quantitative",
    difficulty: "Medium",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "150 meters", "180 meters", "200 meters"],
    correctAnswer: "150 meters",
    explanation: "Speed = 60 km/hr = 60 * (5/18) m/sec = 50/3 m/sec. Length of train = Speed * Time = (50/3) * 9 = 150 meters."
  },
  {
    id: 2,
    category: "Logical",
    difficulty: "Easy",
    question: "Find the missing number in the sequence: 4, 9, 20, 43, 90, ?",
    options: ["180", "185", "183", "190"],
    correctAnswer: "185",
    explanation: "The pattern is: (Previous number * 2) + 1, (Prev * 2) + 2, (Prev * 2) + 3, (Prev * 2) + 4. So, (90 * 2) + 5 = 185."
  },
  {
    id: 3,
    category: "Verbal",
    difficulty: "Easy",
    question: "Choose the synonym of 'PRUDENT':",
    options: ["Careless", "Wise", "Reckless", "Impulsive"],
    correctAnswer: "Wise",
    explanation: "Prudent means showing care and thought for the future, which is synonymous with wise or sensible."
  },
  {
    id: 4,
    category: "Debugging",
    difficulty: "Medium",
    question: "What will be the output of the following C++ code?",
    codeSnippet: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    int b = a++;\n    cout << a << " " << b << endl;\n    return 0;\n}`,
    options: ["5 5", "6 5", "5 6", "6 6"],
    correctAnswer: "6 5",
    explanation: "The post-increment operator (a++) assigns the current value of 'a' (5) to 'b' first, and then increments 'a' to 6. Hence, a = 6, b = 5."
  },
  {
    id: 5,
    category: "Puzzles",
    difficulty: "Hard",
    question: "You have 8 identical-looking balls, but one of them is slightly heavier than the others. Using a balance scale, what is the minimum number of weighings needed to find the heavier ball?",
    options: ["2", "3", "4", "1"],
    correctAnswer: "2",
    explanation: "Step 1: Divide balls into 3 groups: 3, 3, and 2. Weigh the two groups of 3 against each other. If they balance, weigh the remaining 2 to find the heavier one (1 more weighing, total 2). If they don't, take the heavier group of 3, weigh 1 against 1. If they balance, the 3rd one is heavier; if not, you see which is heavier (1 more weighing, total 2)."
  }
];

export interface PreviousYearPaper {
  id: string;
  title: string;
  category: "technical" | "written" | "aptitude" | "reasoning" | "verbal";
  year: number;
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes: number;
  focus: string[];
  questions: string[];
}

export const previousYearPaperBank: PreviousYearPaper[] = [
  {
    id: "tech-dsa-2024",
    title: "Previous Year DSA Technical Paper",
    category: "technical",
    year: 2024,
    difficulty: "Medium",
    durationMinutes: 60,
    focus: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Time Complexity"],
    questions: [
      "Explain the time complexity of binary search and when it fails.",
      "Write a function to reverse a linked list in-place.",
      "Find the longest substring without repeating characters.",
      "Use Kadane's algorithm to find the maximum subarray sum.",
      "Compare BFS and DFS with practical use-cases.",
      "Implement a stack using two queues.",
      "Explain collision handling in hash tables.",
      "Solve the first and last index problem in a sorted array."
    ]
  },
  {
    id: "written-aptitude-2024",
    title: "Previous Year Aptitude & Written Paper",
    category: "written",
    year: 2024,
    difficulty: "Medium",
    durationMinutes: 45,
    focus: ["Percentages", "Time & Work", "Ratio", "Verbal Ability", "Logical Reasoning"],
    questions: [
      "A train travels 120 km in 2 hours. Find the speed in km/hr.",
      "A shopkeeper marks an item 25% above cost price and gives a 10% discount.",
      "Find the next number in the series: 2, 6, 12, 20, 30, ?",
      "Choose the correct grammatical sentence from the four options.",
      "Write a short paragraph on communication in campus placements.",
      "If 12 men complete a task in 10 days, how many days will 8 men take?",
      "Solve a data sufficiency question based on marks and percentages.",
      "Identify the odd-one-out pattern and justify it."
    ]
  },
  {
    id: "tech-dbms-2023",
    title: "DBMS Fundamentals Paper",
    category: "technical",
    year: 2023,
    difficulty: "Medium",
    durationMinutes: 50,
    focus: ["SQL", "Normalization", "Transactions", "Indexes", "Joins"],
    questions: [
      "Explain the difference between inner join and left join.",
      "Write SQL to find the second highest salary from an employee table.",
      "Define normalization and discuss 1NF, 2NF, and 3NF.",
      "What is an index and why is it useful in database design?",
      "Differentiate between shared lock and exclusive lock.",
      "Explain ACID properties with an example.",
      "When would you prefer a foreign key over a duplicate column?",
      "Write a query to find duplicate rows in a table."
    ]
  },
  {
    id: "reasoning-2022",
    title: "Logical Reasoning Practice Paper",
    category: "reasoning",
    year: 2022,
    difficulty: "Easy",
    durationMinutes: 30,
    focus: ["Direction Sense", "Blood Relations", "Seating Arrangement", "Number Series"],
    questions: [
      "Identify the next number in a logical sequence.",
      "Solve a seating arrangement puzzle with 6 people.",
      "Answer a blood-relation question with three generations.",
      "Find the direction of a person after a series of turns.",
      "Determine the odd one out from several coded patterns.",
      "Solve a coding-decoding question using alphabet shifts.",
      "Complete a matrix-based analogy.",
      "Identify the statement that logically follows."
    ]
  }
];

export const buildMixedAssessment = (selection: Array<PreviousYearPaper["category"]> = ["technical", "written", "reasoning"], totalQuestions = 12) => {
  const selectedPapers = previousYearPaperBank.filter((paper) => selection.includes(paper.category));

  const mixedQuestions: string[] = [];
  for (const paper of selectedPapers) {
    for (const question of paper.questions) {
      mixedQuestions.push(`${paper.title}: ${question}`);
    }
  }

  return mixedQuestions.slice(0, totalQuestions);
};

export interface AssessmentMcqQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  functionName: string;
  tests: { input: number; expected: number }[];
  starterTemplate: Record<string, string>;
}

export const aptitudeQuestions: AssessmentMcqQuestion[] = [
  {
    id: "apt-1",
    question: "A train travels 120 km in 2 hours. What is its average speed?",
    options: ["45 km/hr", "55 km/hr", "60 km/hr", "70 km/hr"],
    correctIndex: 2,
    explanation: "Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/hr."
  },
  {
    id: "apt-2",
    question: "If 12 men complete a work in 10 days, how many days will 8 men take to complete the same work?",
    options: ["12 days", "14 days", "15 days", "16 days"],
    correctIndex: 2,
    explanation: "Total work = 12 × 10 = 120 man-days. With 8 men, time = 120 ÷ 8 = 15 days."
  },
  {
    id: "apt-3",
    question: "A product is marked 25% above cost and then sold after a 10% discount. What is the profit percentage?",
    options: ["12.5%", "13.5%", "15%", "17.5%"],
    correctIndex: 0,
    explanation: "If cost = 100, marked price = 125, selling price = 112.5, so profit = 12.5%."
  },
  {
    id: "apt-4",
    question: "The average of 5 consecutive numbers is 18. What is the largest number?",
    options: ["18", "19", "20", "21"],
    correctIndex: 1,
    explanation: "The middle number is 18, so the sequence is 16,17,18,19,20; largest = 20."
  },
  {
    id: "apt-5",
    question: "The simple interest on ₹5000 at 8% per annum for 2 years is:",
    options: ["₹600", "₹700", "₹800", "₹900"],
    correctIndex: 2,
    explanation: "SI = P × R × T / 100 = 5000 × 8 × 2 / 100 = 800."
  }
];

export const reasoningQuestions: AssessmentMcqQuestion[] = [
  {
    id: "reason-1",
    question: "Find the missing number: 2, 6, 12, 20, 30, ?",
    options: ["36", "38", "40", "42"],
    correctIndex: 2,
    explanation: "The pattern is n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, so next is 6×7 = 42."
  },
  {
    id: "reason-2",
    question: "A is the father of B. B is the father of C. What is A to C?",
    options: ["Brother", "Grandfather", "Father", "Uncle"],
    correctIndex: 1,
    explanation: "A is C's grandfather."
  },
  {
    id: "reason-3",
    question: "If all flowers are red and some red are roses, which statement is definitely true?",
    options: ["All roses are flowers", "Some flowers are roses", "All red are flowers", "All roses are red"],
    correctIndex: 1,
    explanation: "Since some red things are roses, and all flowers are red, some flowers are roses is the valid inference."
  },
  {
    id: "reason-4",
    question: "In a code language, B is coded as 2, C as 3, and so on. What is the code for E?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "E is the 5th letter, so it is coded as 5."
  },
  {
    id: "reason-5",
    question: "If East is replaced by North, South by West, and vice versa, what direction would a person facing East now face?",
    options: ["East", "West", "North", "South"],
    correctIndex: 2,
    explanation: "East changes to North according to the rule, so he will face North."
  }
];

export const verbalQuestions: AssessmentMcqQuestion[] = [
  {
    id: "verb-1",
    question: "Choose the correct sentence:",
    options: [
      "She do not know the answer.",
      "She does not know the answer.",
      "She not know the answer.",
      "She are not knowing the answer."
    ],
    correctIndex: 1,
    explanation: "The correct subject-verb agreement is 'she does not know'."
  },
  {
    id: "verb-2",
    question: "The synonym of 'Prudent' is:",
    options: ["Reckless", "Wise", "Lazy", "Weak"],
    correctIndex: 1,
    explanation: "Prudent means careful and wise in judgment."
  },
  {
    id: "verb-3",
    question: "Choose the antonym of 'Expand':",
    options: ["Grow", "Contract", "Increase", "Advance"],
    correctIndex: 1,
    explanation: "Expand means to grow; contract means to shrink."
  },
  {
    id: "verb-4",
    question: "Fill in the blank: The project was completed ___ time.",
    options: ["in", "on", "at", "by"],
    correctIndex: 0,
    explanation: "The correct phrase is 'in time'."
  },
  {
    id: "verb-5",
    question: "Select the sentence with correct punctuation:",
    options: [
      "Although he was tired, he continued working.",
      "Although he was tired he continued working.",
      "Although, he was tired he continued working.",
      "Although he was tired; he continued working."
    ],
    correctIndex: 0,
    explanation: "A comma is needed after the dependent clause in this sentence."
  }
];

export const technicalChallenges: CodingChallenge[] = [
  {
    id: 1,
    title: "Factorial Calculator",
    difficulty: "Easy",
    description: "Write a function to find the factorial of a number.",
    functionName: "factorial",
    tests: [
      { input: 5, expected: 120 },
      { input: 4, expected: 24 }
    ],
    starterTemplate: {
      javascript: "function factorial(n) {\n  // write your code here\n}\n",
      typescript: "function factorial(n: number): number {\n  // write your code here\n  return 1;\n}\n",
      python: "def factorial(n):\n    # write your code here\n    return 1\n",
      cpp: "int factorial(int n) {\n    // write your code here\n    return 1;\n}\n",
      java: "class Solution {\n    static int factorial(int n) {\n        // write your code here\n        return 1;\n    }\n}\n",
      csharp: "class Solution {\n    static int Factorial(int n) {\n        // write your code here\n        return 1;\n    }\n}\n",
      go: "package main\n\nfunc factorial(n int) int {\n    // write your code here\n    return 1\n}\n",
      sql: "SELECT 1; -- write your query here\n"
    }
  },
  {
    id: 2,
    title: "Maximum of Two Numbers",
    difficulty: "Easy",
    description: "Write a function to return the larger of two integers.",
    functionName: "maxOfTwo",
    tests: [
      { input: 8, expected: 8 },
      { input: 12, expected: 12 }
    ],
    starterTemplate: {
      javascript: "function maxOfTwo(a, b) {\n  // write your code here\n}\n",
      typescript: "function maxOfTwo(a: number, b: number): number {\n  // write your code here\n  return a;\n}\n",
      python: "def maxOfTwo(a, b):\n    # write your code here\n    return a\n",
      cpp: "int maxOfTwo(int a, int b) {\n    // write your code here\n    return a;\n}\n",
      java: "class Solution {\n    static int maxOfTwo(int a, int b) {\n        // write your code here\n        return a;\n    }\n}\n",
      csharp: "class Solution {\n    static int MaxOfTwo(int a, int b) {\n        // write your code here\n        return a;\n    }\n}\n",
      go: "package main\n\nfunc maxOfTwo(a, b int) int {\n    // write your code here\n    return a\n}\n",
      sql: "SELECT GREATEST(8, 12); -- write your query here\n"
    }
  }
];

export interface CodingProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  companyTags: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  explanation: string;
  templateCode: { [key: string]: string };
  testCases: { input: string; output: string }[];
}

export const codingProblems: CodingProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    companyTags: ["Amazon", "Google", "TCS", "Accenture", "Microsoft"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "First line: size of array. Second line: space-separated elements. Third line: target integer.",
    outputFormat: "Two space-separated indices.",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    hints: [
      "Can we use a hash map to search in O(1) time?",
      "For each element x, check if (target - x) exists in the map."
    ],
    explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.",
    templateCode: {
      cpp: `#include <vector>\n#include <unordered_map>\n#include <iostream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}`,
      python: `def twoSum(nums, target):\n    # Write your code here\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`,
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}`
    },
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1" },
      { input: "3\n3 2 4\n6", output: "1 2" }
    ]
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    companyTags: ["Google", "Amazon", "Microsoft"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    inputFormat: "A single line containing the string `s`.",
    outputFormat: "An integer indicating the max length.",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    hints: [
      "Use a sliding window approach with two pointers.",
      "Store the index of last seen characters in a map to jump the left pointer efficiently."
    ],
    explanation: "The answer is 'abc', with the length of 3.",
    templateCode: {
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Write your code here\n    return 0;\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # Write your code here\n    return 0`,
      java: `import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}`,
      javascript: `function lengthOfLongestSubstring(s) {\n    // Write your code here\n    return 0;\n}`
    },
    testCases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" }
    ]
  }
];

export interface InterviewDialog {
  speaker: "AI" | "User";
  text: string;
  timestamp: string;
  category?: string;
}

export const mockInterviewQuestions: { [role: string]: string[] } = {
  "Software Engineer": [
    "Tell me about a challenging technical project you worked on. What was the architecture and how did you resolve bottlenecks?",
    "Explain the difference between a SQL and NoSQL database. When would you prefer one over the other in a scaling system?",
    "How does Garbage Collection work under the hood in languages like Java or Python?",
    "Describe a situation where you had a conflict with a team member about technical design. How did you resolve it?",
    "What are solid principles in software engineering? Can you explain Liskov Substitution Principle?"
  ],
  "Data Analyst": [
    "How do you handle missing or corrupted data in a large dataset before modeling?",
    "Explain the difference between inner join, left join, and cross join with examples.",
    "What is A/B testing, and how do you calculate statistical significance?",
    "Describe a time you translated complex data findings into actionable business insights for non-technical stakeholders."
  ],
  "AI Engineer": [
    "What is the difference between supervised, unsupervised, and reinforcement learning?",
    "Explain the vanishing gradient problem in deep neural networks and how to prevent it.",
    "What are LLM fine-tuning techniques, and how do they differ from Retrieval-Augmented Generation (RAG)?",
    "How do you evaluate the performance of an anomaly detection model?"
  ]
};

export const mockCareerCoachResponses = [
  { keywords: ["resume", "cv", "ats"], response: "To boost your resume ATS score, use clear section headings (Skills, Projects, Experience), avoid complex table layouts or graphic elements, list your programming languages explicitly, and match action verbs with project metrics (e.g., 'Optimized database queries, reducing load times by 40%')." },
  { keywords: ["interview", "prep", "mock"], response: "For interviews: 1. Use the STAR method (Situation, Task, Action, Result) for behavioral questions. 2. For coding rounds, speak out loud to explain your logic before writing code. 3. Study core CS subjects: DBMS, OS, and Computer Networks." },
  { keywords: ["salary", "negotiate", "offer"], response: "When negotiating a salary offer, research standard packages for your role and region on sites like Levels.fyi. Express enthusiasm for the team, state the value you bring based on your project skills, and ask: 'Is there flexibility on the base component or sign-on bonus for candidates with my specific stack?'" },
  { keywords: ["project", "idea", "portfolio"], response: "For a standout SDE portfolio project: build a full-stack application that solves a real-world problem (e.g., a real-time collaborative workspace, a smart energy monitor dashboard). Implement WebSockets, caching with Redis, a clean SQL schema, and host it live with a GitHub README showcasing architecture diagrams." },
  { keywords: ["dsa", "leetcode", "algo"], response: "To master DSA systematically, focus on patterns rather than memorizing questions: Sliding Window, Two Pointers, Fast & Slow Pointers, Merge Intervals, Tree Breadth-First Search, Graph DFS, and 0/1 Knapsack. Solve 5-10 clean problems for each pattern." }
];
