// Job-Ready Roadmaps for Indian Students
// Auto-generated 18 course master configuration

export interface RoadmapStep {
    week: number
    topic: string
    description: string
    resources: { name: string; url: string }[]
    practice?: string
}

export interface Topic {
    id: string
    title: string
    difficulty: 'Beginner' | 'Intermediate' | 'Hard'
    duration: string
    videoUrl?: string
    pdfs?: { name: string; url: string }[]
}

export interface Chapter {
    id: string
    title: string
    description: string
    topics: Topic[]
    estimatedHours: number
}

export interface Roadmap {
    id: string
    title: string
    description: string
    duration: string
    level: 'beginner' | 'intermediate' | 'advanced'
    difficulty: string
    icon: string
    color: string
    steps: RoadmapStep[]
    chapters: Chapter[]
    skills: string[]
    careerOutcomes: string[]
    outcome: string
}

export const ROADMAPS: Record<string, Roadmap> = {
    "python-beginners": {
        id: "python-beginners",
        title: "Python for Beginners",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "6 weeks",
        level: "beginner",
        difficulty: "Beginner",
        icon: "🚀",
        color: "from-blue-500 to-cyan-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Python","Problem Solving","Architecture"],
        careerOutcomes: ["Python for Beginners"],
        chapters: [
            {
                id: "ch1-python-beginners",
                title: "Functions",
                description: "Master the concepts of Functions",
                estimatedHours: 13,
                topics: [
                    { id: "topic_1", title: "Defining functions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_2", title: "Parameters and arguments", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_3", title: "Return values", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_4", title: "Lambda functions", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_5", title: "Scope and namespaces", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_6", title: "Practical Scope and namespaces", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_7", title: "Practical Defining functions", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ }
                ]
            },
            {
                id: "ch2-python-beginners",
                title: "Control Flow",
                description: "Master the concepts of Control Flow",
                estimatedHours: 14,
                topics: [
                    { id: "topic_8", title: "If else conditions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_9", title: "Nested conditions", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_10", title: "For loops", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_11", title: "While loops", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_12", title: "Break continue and pass", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_13", title: "Project: For loops", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ }
                ]
            },
            {
                id: "ch3-python-beginners",
                title: "Getting Started",
                description: "Master the concepts of Getting Started",
                estimatedHours: 17,
                topics: [
                    { id: "topic_14", title: "Python installation and setup", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_15", title: "Variables and data types", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_16", title: "String operations and formatting", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_17", title: "User input and output", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_18", title: "Comments and code style", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_19", title: "Project: String operations and formatting", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ }
                ]
            },
            {
                id: "ch4-python-beginners",
                title: "Data Structures",
                description: "Master the concepts of Data Structures",
                estimatedHours: 14,
                topics: [
                    { id: "topic_20", title: "Lists and list methods", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_21", title: "Tuples and sets", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_22", title: "Dictionaries", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_23", title: "List comprehensions", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_24", title: "Nested data structures", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ },
                    { id: "topic_25", title: "Working with files", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/aqvDxdPZiPg" /* CodeWithHarry (Hindi) */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Defining functions",
                    "description": "Learn the fundamentals and advanced applications of Defining functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Defining functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Parameters and arguments",
                    "description": "Learn the fundamentals and advanced applications of Parameters and arguments. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Parameters and arguments to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Return values",
                    "description": "Learn the fundamentals and advanced applications of Return values. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Return values to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Lambda functions",
                    "description": "Learn the fundamentals and advanced applications of Lambda functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lambda functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Scope and namespaces",
                    "description": "Learn the fundamentals and advanced applications of Scope and namespaces. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Scope and namespaces to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Scope and namespaces",
                    "description": "Learn the fundamentals and advanced applications of Practical Scope and namespaces. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Scope and namespaces to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Defining functions",
                    "description": "Learn the fundamentals and advanced applications of Practical Defining functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Defining functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "If else conditions",
                    "description": "Learn the fundamentals and advanced applications of If else conditions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on If else conditions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Nested conditions",
                    "description": "Learn the fundamentals and advanced applications of Nested conditions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Nested conditions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "For loops",
                    "description": "Learn the fundamentals and advanced applications of For loops. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on For loops to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "While loops",
                    "description": "Learn the fundamentals and advanced applications of While loops. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on While loops to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Break continue and pass",
                    "description": "Learn the fundamentals and advanced applications of Break continue and pass. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Break continue and pass to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Project: For loops",
                    "description": "Learn the fundamentals and advanced applications of Project: For loops. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: For loops to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Python installation and setup",
                    "description": "Learn the fundamentals and advanced applications of Python installation and setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Python installation and setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Variables and data types",
                    "description": "Learn the fundamentals and advanced applications of Variables and data types. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Variables and data types to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "String operations and formatting",
                    "description": "Learn the fundamentals and advanced applications of String operations and formatting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on String operations and formatting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "User input and output",
                    "description": "Learn the fundamentals and advanced applications of User input and output. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on User input and output to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Comments and code style",
                    "description": "Learn the fundamentals and advanced applications of Comments and code style. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Comments and code style to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Project: String operations and formatting",
                    "description": "Learn the fundamentals and advanced applications of Project: String operations and formatting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: String operations and formatting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Lists and list methods",
                    "description": "Learn the fundamentals and advanced applications of Lists and list methods. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lists and list methods to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Tuples and sets",
                    "description": "Learn the fundamentals and advanced applications of Tuples and sets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Tuples and sets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Dictionaries",
                    "description": "Learn the fundamentals and advanced applications of Dictionaries. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dictionaries to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "List comprehensions",
                    "description": "Learn the fundamentals and advanced applications of List comprehensions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on List comprehensions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Nested data structures",
                    "description": "Learn the fundamentals and advanced applications of Nested data structures. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Nested data structures to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Working with files",
                    "description": "Learn the fundamentals and advanced applications of Working with files. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Working with files to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "javascript-mastery": {
        id: "javascript-mastery",
        title: "JavaScript Mastery",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "8 weeks",
        level: "beginner",
        difficulty: "Beginner to Advanced",
        icon: "💻",
        color: "from-yellow-400 to-orange-500",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["JavaScript","Problem Solving","Architecture"],
        careerOutcomes: ["JavaScript Mastery"],
        chapters: [
            {
                id: "ch1-javascript-mastery",
                title: "Advanced Patterns",
                description: "Master the concepts of Advanced Patterns",
                estimatedHours: 11,
                topics: [
                    { id: "topic_26", title: "Prototypes and classes", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_27", title: "Modules ES6", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_28", title: "Iterators and generators", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_29", title: "Proxy and Reflect", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_30", title: "V8 engine internals and performance", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_31", title: "Practical V8 engine internals and performance", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ }
                ]
            },
            {
                id: "ch2-javascript-mastery",
                title: "Async JavaScript",
                description: "Master the concepts of Async JavaScript",
                estimatedHours: 19,
                topics: [
                    { id: "topic_32", title: "Callbacks and callback hell", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_33", title: "Promises and chaining", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_34", title: "Async await", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_35", title: "Fetch API and REST calls", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_36", title: "Error handling", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_37", title: "Deep Dive: Fetch API and REST calls", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ }
                ]
            },
            {
                id: "ch3-javascript-mastery",
                title: "The DOM",
                description: "Master the concepts of The DOM",
                estimatedHours: 17,
                topics: [
                    { id: "topic_38", title: "DOM manipulation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_39", title: "Event listeners", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_40", title: "Event bubbling and delegation", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_41", title: "Forms and validation", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_42", title: "Dynamic UI updates", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_43", title: "Advanced Forms and validation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ }
                ]
            },
            {
                id: "ch4-javascript-mastery",
                title: "Functions Deep Dive",
                description: "Master the concepts of Functions Deep Dive",
                estimatedHours: 13,
                topics: [
                    { id: "topic_44", title: "Function declarations vs expressions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_45", title: "Arrow functions", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_46", title: "Higher order functions", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_47", title: "Closures and lexical scope", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_48", title: "Currying and composition", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_49", title: "Project: Closures and lexical scope", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ }
                ]
            },
            {
                id: "ch5-javascript-mastery",
                title: "JS Foundations",
                description: "Master the concepts of JS Foundations",
                estimatedHours: 15,
                topics: [
                    { id: "topic_50", title: "How JavaScript works", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_51", title: "Variables let const var", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_52", title: "Data types and coercion", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_53", title: "Operators and expressions", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_54", title: "Control flow", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ },
                    { id: "topic_55", title: "Interview Qs: How JavaScript works", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg" /* freeCodeCamp (English) */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Prototypes and classes",
                    "description": "Learn the fundamentals and advanced applications of Prototypes and classes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Prototypes and classes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Modules ES6",
                    "description": "Learn the fundamentals and advanced applications of Modules ES6. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Modules ES6 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Iterators and generators",
                    "description": "Learn the fundamentals and advanced applications of Iterators and generators. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Iterators and generators to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Proxy and Reflect",
                    "description": "Learn the fundamentals and advanced applications of Proxy and Reflect. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Proxy and Reflect to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "V8 engine internals and performance",
                    "description": "Learn the fundamentals and advanced applications of V8 engine internals and performance. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on V8 engine internals and performance to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical V8 engine internals and performance",
                    "description": "Learn the fundamentals and advanced applications of Practical V8 engine internals and performance. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical V8 engine internals and performance to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Callbacks and callback hell",
                    "description": "Learn the fundamentals and advanced applications of Callbacks and callback hell. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Callbacks and callback hell to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Promises and chaining",
                    "description": "Learn the fundamentals and advanced applications of Promises and chaining. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Promises and chaining to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Async await",
                    "description": "Learn the fundamentals and advanced applications of Async await. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Async await to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Fetch API and REST calls",
                    "description": "Learn the fundamentals and advanced applications of Fetch API and REST calls. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Fetch API and REST calls to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Error handling",
                    "description": "Learn the fundamentals and advanced applications of Error handling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Error handling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Deep Dive: Fetch API and REST calls",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Fetch API and REST calls. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Fetch API and REST calls to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "DOM manipulation",
                    "description": "Learn the fundamentals and advanced applications of DOM manipulation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DOM manipulation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Event listeners",
                    "description": "Learn the fundamentals and advanced applications of Event listeners. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Event listeners to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Event bubbling and delegation",
                    "description": "Learn the fundamentals and advanced applications of Event bubbling and delegation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Event bubbling and delegation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Forms and validation",
                    "description": "Learn the fundamentals and advanced applications of Forms and validation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Forms and validation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Dynamic UI updates",
                    "description": "Learn the fundamentals and advanced applications of Dynamic UI updates. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dynamic UI updates to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Advanced Forms and validation",
                    "description": "Learn the fundamentals and advanced applications of Advanced Forms and validation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Forms and validation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Function declarations vs expressions",
                    "description": "Learn the fundamentals and advanced applications of Function declarations vs expressions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Function declarations vs expressions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Arrow functions",
                    "description": "Learn the fundamentals and advanced applications of Arrow functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Arrow functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Higher order functions",
                    "description": "Learn the fundamentals and advanced applications of Higher order functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Higher order functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Closures and lexical scope",
                    "description": "Learn the fundamentals and advanced applications of Closures and lexical scope. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Closures and lexical scope to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Currying and composition",
                    "description": "Learn the fundamentals and advanced applications of Currying and composition. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Currying and composition to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Project: Closures and lexical scope",
                    "description": "Learn the fundamentals and advanced applications of Project: Closures and lexical scope. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Closures and lexical scope to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "How JavaScript works",
                    "description": "Learn the fundamentals and advanced applications of How JavaScript works. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on How JavaScript works to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Variables let const var",
                    "description": "Learn the fundamentals and advanced applications of Variables let const var. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Variables let const var to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Data types and coercion",
                    "description": "Learn the fundamentals and advanced applications of Data types and coercion. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Data types and coercion to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Operators and expressions",
                    "description": "Learn the fundamentals and advanced applications of Operators and expressions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Operators and expressions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Control flow",
                    "description": "Learn the fundamentals and advanced applications of Control flow. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Control flow to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Interview Qs: How JavaScript works",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: How JavaScript works. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: How JavaScript works to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "frontend-react": {
        id: "frontend-react",
        title: "Frontend Developer React",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "beginner",
        difficulty: "Beginner",
        icon: "⚛️",
        color: "from-purple-500 to-indigo-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Frontend","Problem Solving","Architecture"],
        careerOutcomes: ["Frontend Developer React"],
        chapters: [
            {
                id: "ch1-frontend-react",
                title: "Advanced React",
                description: "Master the concepts of Advanced React",
                estimatedHours: 15,
                topics: [
                    { id: "topic_56", title: "useReducer and useRef", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_57", title: "Custom hooks", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_58", title: "React Router v6", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_59", title: "Code splitting and lazy loading", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_60", title: "Performance optimization with useMemo and useCallback", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_61", title: "Project: Custom hooks", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_62", title: "Interview Qs: React Router v6", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch2-frontend-react",
                title: "Intermediate React",
                description: "Master the concepts of Intermediate React",
                estimatedHours: 11,
                topics: [
                    { id: "topic_63", title: "Conditional rendering", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_64", title: "Lists and keys", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_65", title: "Forms and controlled components", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_66", title: "Component lifecycle", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_67", title: "Context API", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_68", title: "Interview Qs: Context API", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch3-frontend-react",
                title: "React Basics",
                description: "Master the concepts of React Basics",
                estimatedHours: 10,
                topics: [
                    { id: "topic_69", title: "Create React App and Vite setup", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_70", title: "JSX syntax", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_71", title: "Components and props", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_72", title: "useState hook", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_73", title: "useEffect hook", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_74", title: "Practical JSX syntax", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch4-frontend-react",
                title: "Web Foundations",
                description: "Master the concepts of Web Foundations",
                estimatedHours: 10,
                topics: [
                    { id: "topic_75", title: "HTML5 semantic elements", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_76", title: "CSS3 flexbox and grid", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_77", title: "Responsive design", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_78", title: "CSS variables and animations", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_79", title: "Introduction to JavaScript for React", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_80", title: "Deep Dive: HTML5 semantic elements", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch5-frontend-react",
                title: "Final Projects",
                description: "Master the concepts of Final Projects",
                estimatedHours: 15,
                topics: [
                    { id: "topic_81", title: "Portfolio website", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_82", title: "E-commerce product page", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_83", title: "Real time dashboard", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_84", title: "Deep Dive: Real time dashboard", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_85", title: "Advanced Real time dashboard", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_86", title: "Project: E-commerce product page", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch6-frontend-react",
                title: "State Management",
                description: "Master the concepts of State Management",
                estimatedHours: 10,
                topics: [
                    { id: "topic_87", title: "Redux Toolkit", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_88", title: "Zustand", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_89", title: "React Query for server state", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_90", title: "Jotai atoms", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_91", title: "When to use what", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_92", title: "Deep Dive: Zustand", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_93", title: "Practical Zustand", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            },
            {
                id: "ch7-frontend-react",
                title: "Testing and Deployment",
                description: "Master the concepts of Testing and Deployment",
                estimatedHours: 11,
                topics: [
                    { id: "topic_94", title: "Jest and React Testing Library", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_95", title: "End to end testing with Playwright", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_96", title: "CI/CD with GitHub Actions", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_97", title: "Deploying on Vercel and Netlify", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_98", title: "Performance auditing with Lighthouse", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_99", title: "Advanced CI/CD with GitHub Actions", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ },
                    { id: "topic_100", title: "Deep Dive: Jest and React Testing Library", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" /* Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "useReducer and useRef",
                    "description": "Learn the fundamentals and advanced applications of useReducer and useRef. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on useReducer and useRef to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Custom hooks",
                    "description": "Learn the fundamentals and advanced applications of Custom hooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Custom hooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "React Router v6",
                    "description": "Learn the fundamentals and advanced applications of React Router v6. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React Router v6 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Code splitting and lazy loading",
                    "description": "Learn the fundamentals and advanced applications of Code splitting and lazy loading. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Code splitting and lazy loading to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Performance optimization with useMemo and useCallback",
                    "description": "Learn the fundamentals and advanced applications of Performance optimization with useMemo and useCallback. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Performance optimization with useMemo and useCallback to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Custom hooks",
                    "description": "Learn the fundamentals and advanced applications of Project: Custom hooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Custom hooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Interview Qs: React Router v6",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: React Router v6. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: React Router v6 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Conditional rendering",
                    "description": "Learn the fundamentals and advanced applications of Conditional rendering. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Conditional rendering to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Lists and keys",
                    "description": "Learn the fundamentals and advanced applications of Lists and keys. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lists and keys to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Forms and controlled components",
                    "description": "Learn the fundamentals and advanced applications of Forms and controlled components. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Forms and controlled components to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Component lifecycle",
                    "description": "Learn the fundamentals and advanced applications of Component lifecycle. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Component lifecycle to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Context API",
                    "description": "Learn the fundamentals and advanced applications of Context API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Context API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: Context API",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Context API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Context API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Create React App and Vite setup",
                    "description": "Learn the fundamentals and advanced applications of Create React App and Vite setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Create React App and Vite setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "JSX syntax",
                    "description": "Learn the fundamentals and advanced applications of JSX syntax. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on JSX syntax to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Components and props",
                    "description": "Learn the fundamentals and advanced applications of Components and props. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Components and props to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "useState hook",
                    "description": "Learn the fundamentals and advanced applications of useState hook. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on useState hook to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "useEffect hook",
                    "description": "Learn the fundamentals and advanced applications of useEffect hook. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on useEffect hook to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Practical JSX syntax",
                    "description": "Learn the fundamentals and advanced applications of Practical JSX syntax. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical JSX syntax to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "HTML5 semantic elements",
                    "description": "Learn the fundamentals and advanced applications of HTML5 semantic elements. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on HTML5 semantic elements to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "CSS3 flexbox and grid",
                    "description": "Learn the fundamentals and advanced applications of CSS3 flexbox and grid. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CSS3 flexbox and grid to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Responsive design",
                    "description": "Learn the fundamentals and advanced applications of Responsive design. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Responsive design to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "CSS variables and animations",
                    "description": "Learn the fundamentals and advanced applications of CSS variables and animations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CSS variables and animations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Introduction to JavaScript for React",
                    "description": "Learn the fundamentals and advanced applications of Introduction to JavaScript for React. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Introduction to JavaScript for React to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Deep Dive: HTML5 semantic elements",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: HTML5 semantic elements. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: HTML5 semantic elements to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Portfolio website",
                    "description": "Learn the fundamentals and advanced applications of Portfolio website. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Portfolio website to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "E-commerce product page",
                    "description": "Learn the fundamentals and advanced applications of E-commerce product page. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on E-commerce product page to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Real time dashboard",
                    "description": "Learn the fundamentals and advanced applications of Real time dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Real time dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Deep Dive: Real time dashboard",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Real time dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Real time dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Advanced Real time dashboard",
                    "description": "Learn the fundamentals and advanced applications of Advanced Real time dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Real time dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Project: E-commerce product page",
                    "description": "Learn the fundamentals and advanced applications of Project: E-commerce product page. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: E-commerce product page to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Redux Toolkit",
                    "description": "Learn the fundamentals and advanced applications of Redux Toolkit. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Redux Toolkit to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Zustand",
                    "description": "Learn the fundamentals and advanced applications of Zustand. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Zustand to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "React Query for server state",
                    "description": "Learn the fundamentals and advanced applications of React Query for server state. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React Query for server state to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Jotai atoms",
                    "description": "Learn the fundamentals and advanced applications of Jotai atoms. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Jotai atoms to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "When to use what",
                    "description": "Learn the fundamentals and advanced applications of When to use what. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on When to use what to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Deep Dive: Zustand",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Zustand. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Zustand to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Practical Zustand",
                    "description": "Learn the fundamentals and advanced applications of Practical Zustand. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Zustand to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Jest and React Testing Library",
                    "description": "Learn the fundamentals and advanced applications of Jest and React Testing Library. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Jest and React Testing Library to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "End to end testing with Playwright",
                    "description": "Learn the fundamentals and advanced applications of End to end testing with Playwright. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on End to end testing with Playwright to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "CI/CD with GitHub Actions",
                    "description": "Learn the fundamentals and advanced applications of CI/CD with GitHub Actions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CI/CD with GitHub Actions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deploying on Vercel and Netlify",
                    "description": "Learn the fundamentals and advanced applications of Deploying on Vercel and Netlify. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deploying on Vercel and Netlify to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Performance auditing with Lighthouse",
                    "description": "Learn the fundamentals and advanced applications of Performance auditing with Lighthouse. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Performance auditing with Lighthouse to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced CI/CD with GitHub Actions",
                    "description": "Learn the fundamentals and advanced applications of Advanced CI/CD with GitHub Actions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced CI/CD with GitHub Actions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: Jest and React Testing Library",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Jest and React Testing Library. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Jest and React Testing Library to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "frontend-vue": {
        id: "frontend-vue",
        title: "Frontend Developer Vue.js",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "10 weeks",
        level: "beginner",
        difficulty: "Beginner",
        icon: "🔥",
        color: "from-emerald-400 to-green-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Frontend","Problem Solving","Architecture"],
        careerOutcomes: ["Frontend Developer Vue.js"],
        chapters: [
            {
                id: "ch1-frontend-vue",
                title: "State with Pinia",
                description: "Master the concepts of State with Pinia",
                estimatedHours: 14,
                topics: [
                    { id: "topic_101", title: "Store setup", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_102", title: "State getters actions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_103", title: "Persisting state", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_104", title: "Composables vs stores", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_105", title: "Migrating from Vuex", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_106", title: "Deep Dive: Composables vs stores", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            },
            {
                id: "ch2-frontend-vue",
                title: "Advanced Vue",
                description: "Master the concepts of Advanced Vue",
                estimatedHours: 11,
                topics: [
                    { id: "topic_107", title: "Composition API deep dive", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_108", title: "Custom directives", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_109", title: "Plugins", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_110", title: "Server side rendering with Nuxt", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_111", title: "Testing with Vitest", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            },
            {
                id: "ch3-frontend-vue",
                title: "Vue Router",
                description: "Master the concepts of Vue Router",
                estimatedHours: 19,
                topics: [
                    { id: "topic_112", title: "Route configuration", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_113", title: "Dynamic routes", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_114", title: "Navigation guards", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_115", title: "Lazy loading routes", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_116", title: "Nested routes", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_117", title: "Practical Lazy loading routes", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            },
            {
                id: "ch4-frontend-vue",
                title: "Components",
                description: "Master the concepts of Components",
                estimatedHours: 17,
                topics: [
                    { id: "topic_118", title: "Component communication props and emits", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_119", title: "Slots and scoped slots", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_120", title: "Lifecycle hooks", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_121", title: "Teleport and Suspense", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_122", title: "Dynamic components", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_123", title: "Project: Slots and scoped slots", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            },
            {
                id: "ch5-frontend-vue",
                title: "Vue Fundamentals",
                description: "Master the concepts of Vue Fundamentals",
                estimatedHours: 14,
                topics: [
                    { id: "topic_124", title: "Vue 3 setup and Vite", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_125", title: "Template syntax", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_126", title: "Reactive data with ref and reactive", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_127", title: "Computed properties", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_128", title: "Watchers", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_129", title: "Deep Dive: Vue 3 setup and Vite", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            },
            {
                id: "ch6-frontend-vue",
                title: "Real Projects",
                description: "Master the concepts of Real Projects",
                estimatedHours: 12,
                topics: [
                    { id: "topic_130", title: "Blog platform", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_131", title: "Admin dashboard", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_132", title: "Real time chat", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_133", title: "Deep Dive: Blog platform", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_134", title: "Advanced Blog platform", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ },
                    { id: "topic_135", title: "Advanced Admin dashboard", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/FXpIoQ_rT_c" /* Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Store setup",
                    "description": "Learn the fundamentals and advanced applications of Store setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Store setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "State getters actions",
                    "description": "Learn the fundamentals and advanced applications of State getters actions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on State getters actions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Persisting state",
                    "description": "Learn the fundamentals and advanced applications of Persisting state. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Persisting state to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Composables vs stores",
                    "description": "Learn the fundamentals and advanced applications of Composables vs stores. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Composables vs stores to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Migrating from Vuex",
                    "description": "Learn the fundamentals and advanced applications of Migrating from Vuex. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Migrating from Vuex to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Composables vs stores",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Composables vs stores. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Composables vs stores to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Composition API deep dive",
                    "description": "Learn the fundamentals and advanced applications of Composition API deep dive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Composition API deep dive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Custom directives",
                    "description": "Learn the fundamentals and advanced applications of Custom directives. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Custom directives to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Plugins",
                    "description": "Learn the fundamentals and advanced applications of Plugins. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Plugins to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Server side rendering with Nuxt",
                    "description": "Learn the fundamentals and advanced applications of Server side rendering with Nuxt. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Server side rendering with Nuxt to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Testing with Vitest",
                    "description": "Learn the fundamentals and advanced applications of Testing with Vitest. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Testing with Vitest to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Route configuration",
                    "description": "Learn the fundamentals and advanced applications of Route configuration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Route configuration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Dynamic routes",
                    "description": "Learn the fundamentals and advanced applications of Dynamic routes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dynamic routes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Navigation guards",
                    "description": "Learn the fundamentals and advanced applications of Navigation guards. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Navigation guards to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Lazy loading routes",
                    "description": "Learn the fundamentals and advanced applications of Lazy loading routes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lazy loading routes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Nested routes",
                    "description": "Learn the fundamentals and advanced applications of Nested routes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Nested routes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Practical Lazy loading routes",
                    "description": "Learn the fundamentals and advanced applications of Practical Lazy loading routes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Lazy loading routes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Component communication props and emits",
                    "description": "Learn the fundamentals and advanced applications of Component communication props and emits. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Component communication props and emits to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Slots and scoped slots",
                    "description": "Learn the fundamentals and advanced applications of Slots and scoped slots. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Slots and scoped slots to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Lifecycle hooks",
                    "description": "Learn the fundamentals and advanced applications of Lifecycle hooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lifecycle hooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Teleport and Suspense",
                    "description": "Learn the fundamentals and advanced applications of Teleport and Suspense. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Teleport and Suspense to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Dynamic components",
                    "description": "Learn the fundamentals and advanced applications of Dynamic components. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dynamic components to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Project: Slots and scoped slots",
                    "description": "Learn the fundamentals and advanced applications of Project: Slots and scoped slots. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Slots and scoped slots to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Vue 3 setup and Vite",
                    "description": "Learn the fundamentals and advanced applications of Vue 3 setup and Vite. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Vue 3 setup and Vite to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Template syntax",
                    "description": "Learn the fundamentals and advanced applications of Template syntax. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Template syntax to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Reactive data with ref and reactive",
                    "description": "Learn the fundamentals and advanced applications of Reactive data with ref and reactive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Reactive data with ref and reactive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Computed properties",
                    "description": "Learn the fundamentals and advanced applications of Computed properties. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Computed properties to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Watchers",
                    "description": "Learn the fundamentals and advanced applications of Watchers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Watchers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: Vue 3 setup and Vite",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Vue 3 setup and Vite. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Vue 3 setup and Vite to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Blog platform",
                    "description": "Learn the fundamentals and advanced applications of Blog platform. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Blog platform to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Admin dashboard",
                    "description": "Learn the fundamentals and advanced applications of Admin dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Admin dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Real time chat",
                    "description": "Learn the fundamentals and advanced applications of Real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Deep Dive: Blog platform",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Blog platform. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Blog platform to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Advanced Blog platform",
                    "description": "Learn the fundamentals and advanced applications of Advanced Blog platform. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Blog platform to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Advanced Admin dashboard",
                    "description": "Learn the fundamentals and advanced applications of Advanced Admin dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Admin dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "backend-nodejs": {
        id: "backend-nodejs",
        title: "Backend Developer Node.js",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "⚙️",
        color: "from-pink-500 to-rose-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Backend","Problem Solving","Architecture"],
        careerOutcomes: ["Backend Developer Node.js"],
        chapters: [
            {
                id: "ch1-backend-nodejs",
                title: "API Design",
                description: "Master the concepts of API Design",
                estimatedHours: 12,
                topics: [
                    { id: "topic_136", title: "REST principles", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_137", title: "API versioning", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_138", title: "Rate limiting", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_139", title: "Request validation with Joi", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_140", title: "API documentation with Swagger", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_141", title: "Interview Qs: API versioning", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_142", title: "Advanced Rate limiting", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch2-backend-nodejs",
                title: "Authentication",
                description: "Master the concepts of Authentication",
                estimatedHours: 19,
                topics: [
                    { id: "topic_143", title: "JWT tokens", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_144", title: "Passport.js strategies", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_145", title: "OAuth2 with Google", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_146", title: "Session management", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_147", title: "Refresh token rotation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_148", title: "Advanced JWT tokens", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch3-backend-nodejs",
                title: "Databases",
                description: "Master the concepts of Databases",
                estimatedHours: 10,
                topics: [
                    { id: "topic_149", title: "MongoDB with Mongoose", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_150", title: "Schema design and validation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_151", title: "SQL with PostgreSQL", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_152", title: "Sequelize ORM", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_153", title: "Database indexing and optimization", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_154", title: "Advanced Database indexing and optimization", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch4-backend-nodejs",
                title: "Express Framework",
                description: "Master the concepts of Express Framework",
                estimatedHours: 12,
                topics: [
                    { id: "topic_155", title: "Express setup and middleware", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_156", title: "Routing and controllers", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_157", title: "Request and response objects", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_158", title: "Error handling middleware", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_159", title: "Static files and templating", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_160", title: "Project: Request and response objects", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch5-backend-nodejs",
                title: "Node Foundations",
                description: "Master the concepts of Node Foundations",
                estimatedHours: 13,
                topics: [
                    { id: "topic_161", title: "How Node.js works", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_162", title: "Event loop deep dive", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_163", title: "Modules CommonJS and ESM", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_164", title: "File system operations", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_165", title: "Streams and buffers", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_166", title: "Deep Dive: Streams and buffers", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch6-backend-nodejs",
                title: "Advanced Backend",
                description: "Master the concepts of Advanced Backend",
                estimatedHours: 19,
                topics: [
                    { id: "topic_167", title: "WebSockets with Socket.io", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_168", title: "Message queues with Redis", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_169", title: "Caching strategies", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_170", title: "Microservices basics", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_171", title: "GraphQL with Apollo", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_172", title: "Project: Microservices basics", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_173", title: "Advanced Message queues with Redis", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            },
            {
                id: "ch7-backend-nodejs",
                title: "DevOps for Backend",
                description: "Master the concepts of DevOps for Backend",
                estimatedHours: 14,
                topics: [
                    { id: "topic_174", title: "Docker containerization", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_175", title: "Environment management", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_176", title: "Logging with Winston", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_177", title: "PM2 process management", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_178", title: "Deploying on Railway and Render", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_179", title: "Deep Dive: Environment management", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ },
                    { id: "topic_180", title: "Deep Dive: PM2 process management", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" /* Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "REST principles",
                    "description": "Learn the fundamentals and advanced applications of REST principles. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on REST principles to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "API versioning",
                    "description": "Learn the fundamentals and advanced applications of API versioning. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on API versioning to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Rate limiting",
                    "description": "Learn the fundamentals and advanced applications of Rate limiting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Rate limiting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Request validation with Joi",
                    "description": "Learn the fundamentals and advanced applications of Request validation with Joi. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Request validation with Joi to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "API documentation with Swagger",
                    "description": "Learn the fundamentals and advanced applications of API documentation with Swagger. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on API documentation with Swagger to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Interview Qs: API versioning",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: API versioning. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: API versioning to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Advanced Rate limiting",
                    "description": "Learn the fundamentals and advanced applications of Advanced Rate limiting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Rate limiting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "JWT tokens",
                    "description": "Learn the fundamentals and advanced applications of JWT tokens. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on JWT tokens to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Passport.js strategies",
                    "description": "Learn the fundamentals and advanced applications of Passport.js strategies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Passport.js strategies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "OAuth2 with Google",
                    "description": "Learn the fundamentals and advanced applications of OAuth2 with Google. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OAuth2 with Google to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Session management",
                    "description": "Learn the fundamentals and advanced applications of Session management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Session management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Refresh token rotation",
                    "description": "Learn the fundamentals and advanced applications of Refresh token rotation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Refresh token rotation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Advanced JWT tokens",
                    "description": "Learn the fundamentals and advanced applications of Advanced JWT tokens. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced JWT tokens to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "MongoDB with Mongoose",
                    "description": "Learn the fundamentals and advanced applications of MongoDB with Mongoose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on MongoDB with Mongoose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Schema design and validation",
                    "description": "Learn the fundamentals and advanced applications of Schema design and validation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Schema design and validation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "SQL with PostgreSQL",
                    "description": "Learn the fundamentals and advanced applications of SQL with PostgreSQL. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on SQL with PostgreSQL to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Sequelize ORM",
                    "description": "Learn the fundamentals and advanced applications of Sequelize ORM. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Sequelize ORM to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Database indexing and optimization",
                    "description": "Learn the fundamentals and advanced applications of Database indexing and optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Database indexing and optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Advanced Database indexing and optimization",
                    "description": "Learn the fundamentals and advanced applications of Advanced Database indexing and optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Database indexing and optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Express setup and middleware",
                    "description": "Learn the fundamentals and advanced applications of Express setup and middleware. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Express setup and middleware to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Routing and controllers",
                    "description": "Learn the fundamentals and advanced applications of Routing and controllers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Routing and controllers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Request and response objects",
                    "description": "Learn the fundamentals and advanced applications of Request and response objects. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Request and response objects to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Error handling middleware",
                    "description": "Learn the fundamentals and advanced applications of Error handling middleware. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Error handling middleware to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Static files and templating",
                    "description": "Learn the fundamentals and advanced applications of Static files and templating. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Static files and templating to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Project: Request and response objects",
                    "description": "Learn the fundamentals and advanced applications of Project: Request and response objects. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Request and response objects to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "How Node.js works",
                    "description": "Learn the fundamentals and advanced applications of How Node.js works. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on How Node.js works to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Event loop deep dive",
                    "description": "Learn the fundamentals and advanced applications of Event loop deep dive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Event loop deep dive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Modules CommonJS and ESM",
                    "description": "Learn the fundamentals and advanced applications of Modules CommonJS and ESM. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Modules CommonJS and ESM to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "File system operations",
                    "description": "Learn the fundamentals and advanced applications of File system operations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File system operations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Streams and buffers",
                    "description": "Learn the fundamentals and advanced applications of Streams and buffers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Streams and buffers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: Streams and buffers",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Streams and buffers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Streams and buffers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "WebSockets with Socket.io",
                    "description": "Learn the fundamentals and advanced applications of WebSockets with Socket.io. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on WebSockets with Socket.io to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Message queues with Redis",
                    "description": "Learn the fundamentals and advanced applications of Message queues with Redis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Message queues with Redis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Caching strategies",
                    "description": "Learn the fundamentals and advanced applications of Caching strategies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Caching strategies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Microservices basics",
                    "description": "Learn the fundamentals and advanced applications of Microservices basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Microservices basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "GraphQL with Apollo",
                    "description": "Learn the fundamentals and advanced applications of GraphQL with Apollo. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GraphQL with Apollo to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Project: Microservices basics",
                    "description": "Learn the fundamentals and advanced applications of Project: Microservices basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Microservices basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Advanced Message queues with Redis",
                    "description": "Learn the fundamentals and advanced applications of Advanced Message queues with Redis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Message queues with Redis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Docker containerization",
                    "description": "Learn the fundamentals and advanced applications of Docker containerization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker containerization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Environment management",
                    "description": "Learn the fundamentals and advanced applications of Environment management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Environment management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Logging with Winston",
                    "description": "Learn the fundamentals and advanced applications of Logging with Winston. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Logging with Winston to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "PM2 process management",
                    "description": "Learn the fundamentals and advanced applications of PM2 process management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on PM2 process management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deploying on Railway and Render",
                    "description": "Learn the fundamentals and advanced applications of Deploying on Railway and Render. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deploying on Railway and Render to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: Environment management",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Environment management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Environment management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: PM2 process management",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: PM2 process management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: PM2 process management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "backend-django": {
        id: "backend-django",
        title: "Backend Developer Python Django",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "🐍",
        color: "from-cyan-400 to-blue-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Backend","Problem Solving","Architecture"],
        careerOutcomes: ["Backend Developer Python Django"],
        chapters: [
            {
                id: "ch1-backend-django",
                title: "Authentication",
                description: "Master the concepts of Authentication",
                estimatedHours: 16,
                topics: [
                    { id: "topic_181", title: "Token authentication", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_182", title: "JWT with SimpleJWT", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_183", title: "OAuth2 integration", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_184", title: "Custom user model", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_185", title: "Permission classes", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_186", title: "Practical Permission classes", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_187", title: "Deep Dive: Token authentication", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch2-backend-django",
                title: "Django REST Framework",
                description: "Master the concepts of Django REST Framework",
                estimatedHours: 18,
                topics: [
                    { id: "topic_188", title: "Serializers", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_189", title: "APIView and ViewSets", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_190", title: "Routers", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_191", title: "Permissions and authentication", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_192", title: "Pagination and filtering", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_193", title: "Interview Qs: Serializers", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch3-backend-django",
                title: "Models and Database",
                description: "Master the concepts of Models and Database",
                estimatedHours: 14,
                topics: [
                    { id: "topic_194", title: "ORM and model definition", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_195", title: "Migrations", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_196", title: "QuerySet API", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_197", title: "Model relationships", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_198", title: "Database optimization", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_199", title: "Deep Dive: Migrations", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch4-backend-django",
                title: "Django Foundations",
                description: "Master the concepts of Django Foundations",
                estimatedHours: 13,
                topics: [
                    { id: "topic_200", title: "Django project structure", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_201", title: "Settings and configuration", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_202", title: "URL routing", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_203", title: "Views and templates", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_204", title: "Django admin panel", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_205", title: "Deep Dive: Settings and configuration", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch5-backend-django",
                title: "Final Project",
                description: "Master the concepts of Final Project",
                estimatedHours: 15,
                topics: [
                    { id: "topic_206", title: "Full featured blog API", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_207", title: "E-commerce backend", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_208", title: "Real time notification system", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_209", title: "Project: E-commerce backend", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_210", title: "Deep Dive: Real time notification system", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_211", title: "Project: Full featured blog API", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch6-backend-django",
                title: "Advanced Django",
                description: "Master the concepts of Advanced Django",
                estimatedHours: 13,
                topics: [
                    { id: "topic_212", title: "Celery for background tasks", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_213", title: "Redis caching", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_214", title: "Django channels for WebSockets", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_215", title: "File uploads with S3", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_216", title: "Signal handlers", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_217", title: "Project: Celery for background tasks", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_218", title: "Project: Redis caching", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            },
            {
                id: "ch7-backend-django",
                title: "Testing and Deployment",
                description: "Master the concepts of Testing and Deployment",
                estimatedHours: 11,
                topics: [
                    { id: "topic_219", title: "Unit testing with pytest", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_220", title: "Integration testing", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_221", title: "Docker with Django", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_222", title: "Deploying on Railway", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_223", title: "CI/CD pipeline", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_224", title: "Practical Docker with Django", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ },
                    { id: "topic_225", title: "Advanced CI/CD pipeline", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/F5mRW0jo-U4" /* Dennis Ivy / Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Token authentication",
                    "description": "Learn the fundamentals and advanced applications of Token authentication. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Token authentication to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "JWT with SimpleJWT",
                    "description": "Learn the fundamentals and advanced applications of JWT with SimpleJWT. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on JWT with SimpleJWT to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "OAuth2 integration",
                    "description": "Learn the fundamentals and advanced applications of OAuth2 integration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OAuth2 integration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Custom user model",
                    "description": "Learn the fundamentals and advanced applications of Custom user model. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Custom user model to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Permission classes",
                    "description": "Learn the fundamentals and advanced applications of Permission classes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Permission classes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Permission classes",
                    "description": "Learn the fundamentals and advanced applications of Practical Permission classes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Permission classes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Token authentication",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Token authentication. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Token authentication to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Serializers",
                    "description": "Learn the fundamentals and advanced applications of Serializers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Serializers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "APIView and ViewSets",
                    "description": "Learn the fundamentals and advanced applications of APIView and ViewSets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on APIView and ViewSets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Routers",
                    "description": "Learn the fundamentals and advanced applications of Routers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Routers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Permissions and authentication",
                    "description": "Learn the fundamentals and advanced applications of Permissions and authentication. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Permissions and authentication to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Pagination and filtering",
                    "description": "Learn the fundamentals and advanced applications of Pagination and filtering. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Pagination and filtering to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: Serializers",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Serializers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Serializers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "ORM and model definition",
                    "description": "Learn the fundamentals and advanced applications of ORM and model definition. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ORM and model definition to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Migrations",
                    "description": "Learn the fundamentals and advanced applications of Migrations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Migrations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "QuerySet API",
                    "description": "Learn the fundamentals and advanced applications of QuerySet API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on QuerySet API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Model relationships",
                    "description": "Learn the fundamentals and advanced applications of Model relationships. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model relationships to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Database optimization",
                    "description": "Learn the fundamentals and advanced applications of Database optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Database optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Deep Dive: Migrations",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Migrations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Migrations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Django project structure",
                    "description": "Learn the fundamentals and advanced applications of Django project structure. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Django project structure to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Settings and configuration",
                    "description": "Learn the fundamentals and advanced applications of Settings and configuration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Settings and configuration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "URL routing",
                    "description": "Learn the fundamentals and advanced applications of URL routing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on URL routing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Views and templates",
                    "description": "Learn the fundamentals and advanced applications of Views and templates. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Views and templates to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Django admin panel",
                    "description": "Learn the fundamentals and advanced applications of Django admin panel. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Django admin panel to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Deep Dive: Settings and configuration",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Settings and configuration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Settings and configuration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Full featured blog API",
                    "description": "Learn the fundamentals and advanced applications of Full featured blog API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Full featured blog API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "E-commerce backend",
                    "description": "Learn the fundamentals and advanced applications of E-commerce backend. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on E-commerce backend to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Real time notification system",
                    "description": "Learn the fundamentals and advanced applications of Real time notification system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Real time notification system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Project: E-commerce backend",
                    "description": "Learn the fundamentals and advanced applications of Project: E-commerce backend. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: E-commerce backend to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Deep Dive: Real time notification system",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Real time notification system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Real time notification system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Project: Full featured blog API",
                    "description": "Learn the fundamentals and advanced applications of Project: Full featured blog API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Full featured blog API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Celery for background tasks",
                    "description": "Learn the fundamentals and advanced applications of Celery for background tasks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Celery for background tasks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Redis caching",
                    "description": "Learn the fundamentals and advanced applications of Redis caching. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Redis caching to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Django channels for WebSockets",
                    "description": "Learn the fundamentals and advanced applications of Django channels for WebSockets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Django channels for WebSockets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "File uploads with S3",
                    "description": "Learn the fundamentals and advanced applications of File uploads with S3. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File uploads with S3 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Signal handlers",
                    "description": "Learn the fundamentals and advanced applications of Signal handlers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Signal handlers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Project: Celery for background tasks",
                    "description": "Learn the fundamentals and advanced applications of Project: Celery for background tasks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Celery for background tasks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Project: Redis caching",
                    "description": "Learn the fundamentals and advanced applications of Project: Redis caching. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Redis caching to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Unit testing with pytest",
                    "description": "Learn the fundamentals and advanced applications of Unit testing with pytest. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Unit testing with pytest to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Integration testing",
                    "description": "Learn the fundamentals and advanced applications of Integration testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Integration testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Docker with Django",
                    "description": "Learn the fundamentals and advanced applications of Docker with Django. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker with Django to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deploying on Railway",
                    "description": "Learn the fundamentals and advanced applications of Deploying on Railway. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deploying on Railway to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "CI/CD pipeline",
                    "description": "Learn the fundamentals and advanced applications of CI/CD pipeline. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CI/CD pipeline to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Practical Docker with Django",
                    "description": "Learn the fundamentals and advanced applications of Practical Docker with Django. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Docker with Django to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced CI/CD pipeline",
                    "description": "Learn the fundamentals and advanced applications of Advanced CI/CD pipeline. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced CI/CD pipeline to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "fullstack-mern": {
        id: "fullstack-mern",
        title: "Full Stack MERN",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "16 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "🌐",
        color: "from-orange-500 to-red-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Full","Problem Solving","Architecture"],
        careerOutcomes: ["Full Stack MERN"],
        chapters: [
            {
                id: "ch1-fullstack-mern",
                title: "Express and Node",
                description: "Master the concepts of Express and Node",
                estimatedHours: 17,
                topics: [
                    { id: "topic_226", title: "Server setup", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_227", title: "REST API design", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_228", title: "Middleware chain", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_229", title: "Error handling", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_230", title: "Environment configuration", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_231", title: "Project: Middleware chain", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_232", title: "Project: Server setup", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch2-fullstack-mern",
                title: "MongoDB",
                description: "Master the concepts of MongoDB",
                estimatedHours: 17,
                topics: [
                    { id: "topic_233", title: "Document model", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_234", title: "CRUD operations", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_235", title: "Aggregation pipeline", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_236", title: "Indexing", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_237", title: "Atlas cloud setup", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_238", title: "Interview Qs: Document model", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch3-fullstack-mern",
                title: "Capstone Projects",
                description: "Master the concepts of Capstone Projects",
                estimatedHours: 14,
                topics: [
                    { id: "topic_239", title: "Social media platform", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_240", title: "Project management tool", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_241", title: "Real time marketplace", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_242", title: "Practical Project management tool", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_243", title: "Interview Qs: Project management tool", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_244", title: "Deep Dive: Real time marketplace", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch4-fullstack-mern",
                title: "Real Time Features",
                description: "Master the concepts of Real Time Features",
                estimatedHours: 16,
                topics: [
                    { id: "topic_245", title: "Socket.io chat", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_246", title: "Live notifications", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_247", title: "Collaborative editing basics", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_248", title: "Real time dashboard", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_249", title: "Advanced Collaborative editing basics", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_250", title: "Interview Qs: Live notifications", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch5-fullstack-mern",
                title: "React Frontend",
                description: "Master the concepts of React Frontend",
                estimatedHours: 11,
                topics: [
                    { id: "topic_251", title: "Component architecture", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_252", title: "Hooks deep dive", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_253", title: "Context and state", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_254", title: "React Router", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_255", title: "API integration", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_256", title: "Deep Dive: API integration", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_257", title: "Advanced Context and state", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch6-fullstack-mern",
                title: "Node Advanced",
                description: "Master the concepts of Node Advanced",
                estimatedHours: 12,
                topics: [
                    { id: "topic_258", title: "Authentication with JWT", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_259", title: "File uploads with Multer", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_260", title: "Email with Nodemailer", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_261", title: "WebSockets", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_262", title: "Job queues", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_263", title: "Interview Qs: Authentication with JWT", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_264", title: "Project: Email with Nodemailer", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch7-fullstack-mern",
                title: "Redux and State",
                description: "Master the concepts of Redux and State",
                estimatedHours: 14,
                topics: [
                    { id: "topic_265", title: "Redux Toolkit setup", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_266", title: "Async thunks", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_267", title: "RTK Query", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_268", title: "Optimistic updates", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_269", title: "State normalization", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_270", title: "Practical Async thunks", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_271", title: "Interview Qs: State normalization", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch8-fullstack-mern",
                title: "Full Stack Integration",
                description: "Master the concepts of Full Stack Integration",
                estimatedHours: 19,
                topics: [
                    { id: "topic_272", title: "Connecting React to Express", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_273", title: "CORS configuration", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_274", title: "Proxy setup", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_275", title: "Cookie handling", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_276", title: "Deployment architecture", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_277", title: "Interview Qs: Proxy setup", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_278", title: "Deep Dive: Cookie handling", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch9-fullstack-mern",
                title: "Testing and Launch",
                description: "Master the concepts of Testing and Launch",
                estimatedHours: 19,
                topics: [
                    { id: "topic_279", title: "API testing with Supertest", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_280", title: "React testing", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_281", title: "Docker compose full stack", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_282", title: "Deploying on VPS", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_283", title: "Domain and SSL setup", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_284", title: "Project: Domain and SSL setup", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ },
                    { id: "topic_285", title: "Advanced API testing with Supertest", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fnpmR6Q5lEc" /* Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Server setup",
                    "description": "Learn the fundamentals and advanced applications of Server setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Server setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "REST API design",
                    "description": "Learn the fundamentals and advanced applications of REST API design. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on REST API design to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Middleware chain",
                    "description": "Learn the fundamentals and advanced applications of Middleware chain. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Middleware chain to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Error handling",
                    "description": "Learn the fundamentals and advanced applications of Error handling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Error handling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Environment configuration",
                    "description": "Learn the fundamentals and advanced applications of Environment configuration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Environment configuration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Middleware chain",
                    "description": "Learn the fundamentals and advanced applications of Project: Middleware chain. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Middleware chain to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Server setup",
                    "description": "Learn the fundamentals and advanced applications of Project: Server setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Server setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Document model",
                    "description": "Learn the fundamentals and advanced applications of Document model. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Document model to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "CRUD operations",
                    "description": "Learn the fundamentals and advanced applications of CRUD operations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CRUD operations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Aggregation pipeline",
                    "description": "Learn the fundamentals and advanced applications of Aggregation pipeline. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Aggregation pipeline to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Indexing",
                    "description": "Learn the fundamentals and advanced applications of Indexing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Indexing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Atlas cloud setup",
                    "description": "Learn the fundamentals and advanced applications of Atlas cloud setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Atlas cloud setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: Document model",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Document model. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Document model to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Social media platform",
                    "description": "Learn the fundamentals and advanced applications of Social media platform. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Social media platform to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Project management tool",
                    "description": "Learn the fundamentals and advanced applications of Project management tool. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project management tool to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Real time marketplace",
                    "description": "Learn the fundamentals and advanced applications of Real time marketplace. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Real time marketplace to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Practical Project management tool",
                    "description": "Learn the fundamentals and advanced applications of Practical Project management tool. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Project management tool to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Interview Qs: Project management tool",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Project management tool. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Project management tool to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Deep Dive: Real time marketplace",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Real time marketplace. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Real time marketplace to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Socket.io chat",
                    "description": "Learn the fundamentals and advanced applications of Socket.io chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Socket.io chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Live notifications",
                    "description": "Learn the fundamentals and advanced applications of Live notifications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Live notifications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Collaborative editing basics",
                    "description": "Learn the fundamentals and advanced applications of Collaborative editing basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Collaborative editing basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Real time dashboard",
                    "description": "Learn the fundamentals and advanced applications of Real time dashboard. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Real time dashboard to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Advanced Collaborative editing basics",
                    "description": "Learn the fundamentals and advanced applications of Advanced Collaborative editing basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Collaborative editing basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Interview Qs: Live notifications",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Live notifications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Live notifications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Component architecture",
                    "description": "Learn the fundamentals and advanced applications of Component architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Component architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Hooks deep dive",
                    "description": "Learn the fundamentals and advanced applications of Hooks deep dive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hooks deep dive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Context and state",
                    "description": "Learn the fundamentals and advanced applications of Context and state. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Context and state to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "React Router",
                    "description": "Learn the fundamentals and advanced applications of React Router. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React Router to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "API integration",
                    "description": "Learn the fundamentals and advanced applications of API integration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on API integration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: API integration",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: API integration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: API integration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Advanced Context and state",
                    "description": "Learn the fundamentals and advanced applications of Advanced Context and state. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Context and state to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Authentication with JWT",
                    "description": "Learn the fundamentals and advanced applications of Authentication with JWT. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Authentication with JWT to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "File uploads with Multer",
                    "description": "Learn the fundamentals and advanced applications of File uploads with Multer. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File uploads with Multer to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Email with Nodemailer",
                    "description": "Learn the fundamentals and advanced applications of Email with Nodemailer. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Email with Nodemailer to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "WebSockets",
                    "description": "Learn the fundamentals and advanced applications of WebSockets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on WebSockets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Job queues",
                    "description": "Learn the fundamentals and advanced applications of Job queues. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Job queues to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Interview Qs: Authentication with JWT",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Authentication with JWT. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Authentication with JWT to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Project: Email with Nodemailer",
                    "description": "Learn the fundamentals and advanced applications of Project: Email with Nodemailer. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Email with Nodemailer to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Redux Toolkit setup",
                    "description": "Learn the fundamentals and advanced applications of Redux Toolkit setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Redux Toolkit setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Async thunks",
                    "description": "Learn the fundamentals and advanced applications of Async thunks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Async thunks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "RTK Query",
                    "description": "Learn the fundamentals and advanced applications of RTK Query. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RTK Query to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Optimistic updates",
                    "description": "Learn the fundamentals and advanced applications of Optimistic updates. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Optimistic updates to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "State normalization",
                    "description": "Learn the fundamentals and advanced applications of State normalization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on State normalization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Practical Async thunks",
                    "description": "Learn the fundamentals and advanced applications of Practical Async thunks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Async thunks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Interview Qs: State normalization",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: State normalization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: State normalization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Connecting React to Express",
                    "description": "Learn the fundamentals and advanced applications of Connecting React to Express. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Connecting React to Express to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "CORS configuration",
                    "description": "Learn the fundamentals and advanced applications of CORS configuration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CORS configuration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Proxy setup",
                    "description": "Learn the fundamentals and advanced applications of Proxy setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Proxy setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Cookie handling",
                    "description": "Learn the fundamentals and advanced applications of Cookie handling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cookie handling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Deployment architecture",
                    "description": "Learn the fundamentals and advanced applications of Deployment architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deployment architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Interview Qs: Proxy setup",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Proxy setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Proxy setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Deep Dive: Cookie handling",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Cookie handling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Cookie handling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "API testing with Supertest",
                    "description": "Learn the fundamentals and advanced applications of API testing with Supertest. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on API testing with Supertest to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "React testing",
                    "description": "Learn the fundamentals and advanced applications of React testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Docker compose full stack",
                    "description": "Learn the fundamentals and advanced applications of Docker compose full stack. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker compose full stack to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Deploying on VPS",
                    "description": "Learn the fundamentals and advanced applications of Deploying on VPS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deploying on VPS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Domain and SSL setup",
                    "description": "Learn the fundamentals and advanced applications of Domain and SSL setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Domain and SSL setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Project: Domain and SSL setup",
                    "description": "Learn the fundamentals and advanced applications of Project: Domain and SSL setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Domain and SSL setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Advanced API testing with Supertest",
                    "description": "Learn the fundamentals and advanced applications of Advanced API testing with Supertest. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced API testing with Supertest to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "dsa-interviews": {
        id: "dsa-interviews",
        title: "DSA for Interviews",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "16 weeks",
        level: "advanced",
        difficulty: "Intermediate to Advanced",
        icon: "🧠",
        color: "from-indigo-400 to-purple-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["DSA","Problem Solving","Architecture"],
        careerOutcomes: ["DSA for Interviews"],
        chapters: [
            {
                id: "ch1-dsa-interviews",
                title: "Trees",
                description: "Master the concepts of Trees",
                estimatedHours: 13,
                topics: [
                    { id: "topic_286", title: "Binary trees traversal", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_287", title: "BST operations", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_288", title: "Level order BFS", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_289", title: "DFS patterns", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_290", title: "Lowest common ancestor", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_291", title: "Deep Dive: DFS patterns", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_292", title: "Advanced Lowest common ancestor", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch2-dsa-interviews",
                title: "Stacks and Queues",
                description: "Master the concepts of Stacks and Queues",
                estimatedHours: 19,
                topics: [
                    { id: "topic_293", title: "Stack implementation", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_294", title: "Monotonic stacks", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_295", title: "Queue and deque", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_296", title: "Priority queues", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_297", title: "Problems and patterns", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_298", title: "Practical Priority queues", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch3-dsa-interviews",
                title: "Linked Lists",
                description: "Master the concepts of Linked Lists",
                estimatedHours: 18,
                topics: [
                    { id: "topic_299", title: "Singly and doubly linked lists", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_300", title: "Fast and slow pointers", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_301", title: "Reversing linked lists", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_302", title: "Merge sorted lists", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_303", title: "Detect cycles", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_304", title: "Project: Reversing linked lists", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch4-dsa-interviews",
                title: "Foundations",
                description: "Master the concepts of Foundations",
                estimatedHours: 13,
                topics: [
                    { id: "topic_305", title: "Big O notation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_306", title: "Arrays and strings", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_307", title: "Two pointers technique", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_308", title: "Sliding window", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_309", title: "Prefix sums", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_310", title: "Interview Qs: Big O notation", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch5-dsa-interviews",
                title: "Heaps and Hashing",
                description: "Master the concepts of Heaps and Hashing",
                estimatedHours: 14,
                topics: [
                    { id: "topic_311", title: "Min max heap", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_312", title: "Top K problems", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_313", title: "HashMap patterns", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_314", title: "Two sum variations", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_315", title: "Group anagrams", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_316", title: "Project: Top K problems", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_317", title: "Interview Qs: Top K problems", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch6-dsa-interviews",
                title: "Graphs",
                description: "Master the concepts of Graphs",
                estimatedHours: 11,
                topics: [
                    { id: "topic_318", title: "BFS and DFS", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_319", title: "Topological sort", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_320", title: "Union Find", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_321", title: "Dijkstra shortest path", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_322", title: "Minimum spanning tree", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_323", title: "Practical Minimum spanning tree", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_324", title: "Interview Qs: Minimum spanning tree", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch7-dsa-interviews",
                title: "Dynamic Programming",
                description: "Master the concepts of Dynamic Programming",
                estimatedHours: 13,
                topics: [
                    { id: "topic_325", title: "Memoization vs tabulation", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_326", title: "1D DP patterns", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_327", title: "2D DP patterns", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_328", title: "Knapsack problems", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_329", title: "LCS and LIS", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_330", title: "Practical Memoization vs tabulation", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_331", title: "Deep Dive: Knapsack problems", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch8-dsa-interviews",
                title: "Advanced Topics",
                description: "Master the concepts of Advanced Topics",
                estimatedHours: 12,
                topics: [
                    { id: "topic_332", title: "Tries", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_333", title: "Segment trees", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_334", title: "Backtracking", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_335", title: "Bit manipulation", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_336", title: "System design basics", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_337", title: "Advanced System design basics", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_338", title: "Project: Segment trees", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            },
            {
                id: "ch9-dsa-interviews",
                title: "Interview Preparation",
                description: "Master the concepts of Interview Preparation",
                estimatedHours: 16,
                topics: [
                    { id: "topic_339", title: "Mock interview problems", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_340", title: "Company specific patterns", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_341", title: "Google problems", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_342", title: "Amazon problems", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_343", title: "Time and space optimization", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_344", title: "Interview Qs: Google problems", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ },
                    { id: "topic_345", title: "Project: Time and space optimization", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/pkYVOmU3MgA" /* NeetCode (English) */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Binary trees traversal",
                    "description": "Learn the fundamentals and advanced applications of Binary trees traversal. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Binary trees traversal to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "BST operations",
                    "description": "Learn the fundamentals and advanced applications of BST operations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on BST operations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Level order BFS",
                    "description": "Learn the fundamentals and advanced applications of Level order BFS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Level order BFS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "DFS patterns",
                    "description": "Learn the fundamentals and advanced applications of DFS patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DFS patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Lowest common ancestor",
                    "description": "Learn the fundamentals and advanced applications of Lowest common ancestor. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lowest common ancestor to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: DFS patterns",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: DFS patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: DFS patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Advanced Lowest common ancestor",
                    "description": "Learn the fundamentals and advanced applications of Advanced Lowest common ancestor. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Lowest common ancestor to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Stack implementation",
                    "description": "Learn the fundamentals and advanced applications of Stack implementation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Stack implementation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Monotonic stacks",
                    "description": "Learn the fundamentals and advanced applications of Monotonic stacks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Monotonic stacks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Queue and deque",
                    "description": "Learn the fundamentals and advanced applications of Queue and deque. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Queue and deque to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Priority queues",
                    "description": "Learn the fundamentals and advanced applications of Priority queues. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Priority queues to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Problems and patterns",
                    "description": "Learn the fundamentals and advanced applications of Problems and patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Problems and patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Practical Priority queues",
                    "description": "Learn the fundamentals and advanced applications of Practical Priority queues. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Priority queues to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Singly and doubly linked lists",
                    "description": "Learn the fundamentals and advanced applications of Singly and doubly linked lists. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Singly and doubly linked lists to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Fast and slow pointers",
                    "description": "Learn the fundamentals and advanced applications of Fast and slow pointers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Fast and slow pointers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Reversing linked lists",
                    "description": "Learn the fundamentals and advanced applications of Reversing linked lists. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Reversing linked lists to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Merge sorted lists",
                    "description": "Learn the fundamentals and advanced applications of Merge sorted lists. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Merge sorted lists to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Detect cycles",
                    "description": "Learn the fundamentals and advanced applications of Detect cycles. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Detect cycles to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Project: Reversing linked lists",
                    "description": "Learn the fundamentals and advanced applications of Project: Reversing linked lists. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Reversing linked lists to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Big O notation",
                    "description": "Learn the fundamentals and advanced applications of Big O notation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Big O notation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Arrays and strings",
                    "description": "Learn the fundamentals and advanced applications of Arrays and strings. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Arrays and strings to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Two pointers technique",
                    "description": "Learn the fundamentals and advanced applications of Two pointers technique. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Two pointers technique to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Sliding window",
                    "description": "Learn the fundamentals and advanced applications of Sliding window. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Sliding window to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Prefix sums",
                    "description": "Learn the fundamentals and advanced applications of Prefix sums. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Prefix sums to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Interview Qs: Big O notation",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Big O notation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Big O notation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Min max heap",
                    "description": "Learn the fundamentals and advanced applications of Min max heap. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Min max heap to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Top K problems",
                    "description": "Learn the fundamentals and advanced applications of Top K problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Top K problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "HashMap patterns",
                    "description": "Learn the fundamentals and advanced applications of HashMap patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on HashMap patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Two sum variations",
                    "description": "Learn the fundamentals and advanced applications of Two sum variations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Two sum variations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Group anagrams",
                    "description": "Learn the fundamentals and advanced applications of Group anagrams. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Group anagrams to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Project: Top K problems",
                    "description": "Learn the fundamentals and advanced applications of Project: Top K problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Top K problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Interview Qs: Top K problems",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Top K problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Top K problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "BFS and DFS",
                    "description": "Learn the fundamentals and advanced applications of BFS and DFS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on BFS and DFS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Topological sort",
                    "description": "Learn the fundamentals and advanced applications of Topological sort. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Topological sort to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Union Find",
                    "description": "Learn the fundamentals and advanced applications of Union Find. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Union Find to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Dijkstra shortest path",
                    "description": "Learn the fundamentals and advanced applications of Dijkstra shortest path. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dijkstra shortest path to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Minimum spanning tree",
                    "description": "Learn the fundamentals and advanced applications of Minimum spanning tree. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Minimum spanning tree to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Practical Minimum spanning tree",
                    "description": "Learn the fundamentals and advanced applications of Practical Minimum spanning tree. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Minimum spanning tree to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Interview Qs: Minimum spanning tree",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Minimum spanning tree. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Minimum spanning tree to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Memoization vs tabulation",
                    "description": "Learn the fundamentals and advanced applications of Memoization vs tabulation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Memoization vs tabulation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "1D DP patterns",
                    "description": "Learn the fundamentals and advanced applications of 1D DP patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on 1D DP patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "2D DP patterns",
                    "description": "Learn the fundamentals and advanced applications of 2D DP patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on 2D DP patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Knapsack problems",
                    "description": "Learn the fundamentals and advanced applications of Knapsack problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Knapsack problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "LCS and LIS",
                    "description": "Learn the fundamentals and advanced applications of LCS and LIS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on LCS and LIS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Practical Memoization vs tabulation",
                    "description": "Learn the fundamentals and advanced applications of Practical Memoization vs tabulation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Memoization vs tabulation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Deep Dive: Knapsack problems",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Knapsack problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Knapsack problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Tries",
                    "description": "Learn the fundamentals and advanced applications of Tries. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Tries to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Segment trees",
                    "description": "Learn the fundamentals and advanced applications of Segment trees. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Segment trees to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Backtracking",
                    "description": "Learn the fundamentals and advanced applications of Backtracking. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Backtracking to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Bit manipulation",
                    "description": "Learn the fundamentals and advanced applications of Bit manipulation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bit manipulation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "System design basics",
                    "description": "Learn the fundamentals and advanced applications of System design basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on System design basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Advanced System design basics",
                    "description": "Learn the fundamentals and advanced applications of Advanced System design basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced System design basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Project: Segment trees",
                    "description": "Learn the fundamentals and advanced applications of Project: Segment trees. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Segment trees to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Mock interview problems",
                    "description": "Learn the fundamentals and advanced applications of Mock interview problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Mock interview problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Company specific patterns",
                    "description": "Learn the fundamentals and advanced applications of Company specific patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Company specific patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Google problems",
                    "description": "Learn the fundamentals and advanced applications of Google problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Google problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Amazon problems",
                    "description": "Learn the fundamentals and advanced applications of Amazon problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Amazon problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Time and space optimization",
                    "description": "Learn the fundamentals and advanced applications of Time and space optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Time and space optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Interview Qs: Google problems",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Google problems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Google problems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Project: Time and space optimization",
                    "description": "Learn the fundamentals and advanced applications of Project: Time and space optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Time and space optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "machine-learning": {
        id: "machine-learning",
        title: "Machine Learning Engineer",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "16 weeks",
        level: "advanced",
        difficulty: "Advanced",
        icon: "🤖",
        color: "from-blue-500 to-cyan-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Machine","Problem Solving","Architecture"],
        careerOutcomes: ["Machine Learning Engineer"],
        chapters: [
            {
                id: "ch1-machine-learning",
                title: "ML Fundamentals",
                description: "Master the concepts of ML Fundamentals",
                estimatedHours: 16,
                topics: [
                    { id: "topic_346", title: "Supervised vs unsupervised", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_347", title: "Train test split", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_348", title: "Cross validation", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_349", title: "Bias variance tradeoff", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_350", title: "Feature engineering", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_351", title: "Interview Qs: Train test split", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_352", title: "Project: Bias variance tradeoff", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch2-machine-learning",
                title: "Math Foundations",
                description: "Master the concepts of Math Foundations",
                estimatedHours: 16,
                topics: [
                    { id: "topic_353", title: "Linear algebra for ML", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_354", title: "Calculus and gradients", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_355", title: "Probability and statistics", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_356", title: "NumPy operations", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_357", title: "Matplotlib visualization", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_358", title: "Deep Dive: Linear algebra for ML", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch3-machine-learning",
                title: "Projects",
                description: "Master the concepts of Projects",
                estimatedHours: 10,
                topics: [
                    { id: "topic_359", title: "House price prediction", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_360", title: "Image classifier", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_361", title: "Sentiment analysis", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_362", title: "Recommendation system", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_363", title: "Interview Qs: House price prediction", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_364", title: "Project: Sentiment analysis", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch4-machine-learning",
                title: "Interview Prep",
                description: "Master the concepts of Interview Prep",
                estimatedHours: 18,
                topics: [
                    { id: "topic_365", title: "ML system design", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_366", title: "Common interview questions", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_367", title: "Case studies", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_368", title: "Portfolio building", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_369", title: "Practical Case studies", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_370", title: "Interview Qs: Common interview questions", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch5-machine-learning",
                title: "Classical ML",
                description: "Master the concepts of Classical ML",
                estimatedHours: 14,
                topics: [
                    { id: "topic_371", title: "Linear regression", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_372", title: "Logistic regression", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_373", title: "Decision trees", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_374", title: "Random forests", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_375", title: "SVM and KNN", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_376", title: "Advanced SVM and KNN", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_377", title: "Interview Qs: Linear regression", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch6-machine-learning",
                title: "Scikit Learn",
                description: "Master the concepts of Scikit Learn",
                estimatedHours: 18,
                topics: [
                    { id: "topic_378", title: "Pipeline building", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_379", title: "Preprocessing", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_380", title: "Model selection", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_381", title: "GridSearchCV", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_382", title: "Model evaluation metrics", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_383", title: "Project: Pipeline building", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_384", title: "Practical Model evaluation metrics", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch7-machine-learning",
                title: "Neural Networks",
                description: "Master the concepts of Neural Networks",
                estimatedHours: 14,
                topics: [
                    { id: "topic_385", title: "Perceptron and activation functions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_386", title: "Backpropagation", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_387", title: "Keras and TensorFlow basics", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_388", title: "CNN architecture", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_389", title: "RNN and LSTM", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_390", title: "Deep Dive: RNN and LSTM", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_391", title: "Interview Qs: Keras and TensorFlow basics", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch8-machine-learning",
                title: "Deep Learning",
                description: "Master the concepts of Deep Learning",
                estimatedHours: 18,
                topics: [
                    { id: "topic_392", title: "Transfer learning", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_393", title: "Fine tuning pretrained models", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_394", title: "Object detection with YOLO", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_395", title: "Image segmentation", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_396", title: "GANs introduction", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_397", title: "Interview Qs: GANs introduction", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_398", title: "Project: GANs introduction", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch9-machine-learning",
                title: "MLOps",
                description: "Master the concepts of MLOps",
                estimatedHours: 16,
                topics: [
                    { id: "topic_399", title: "Experiment tracking with MLflow", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_400", title: "Model serving with FastAPI", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_401", title: "Docker for ML", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_402", title: "Model monitoring", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_403", title: "A/B testing models", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_404", title: "Practical A/B testing models", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ },
                    { id: "topic_405", title: "Interview Qs: Experiment tracking with MLflow", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/NWONeJKn9Kc" /* freeCodeCamp */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Supervised vs unsupervised",
                    "description": "Learn the fundamentals and advanced applications of Supervised vs unsupervised. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Supervised vs unsupervised to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Train test split",
                    "description": "Learn the fundamentals and advanced applications of Train test split. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Train test split to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Cross validation",
                    "description": "Learn the fundamentals and advanced applications of Cross validation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cross validation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Bias variance tradeoff",
                    "description": "Learn the fundamentals and advanced applications of Bias variance tradeoff. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bias variance tradeoff to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Feature engineering",
                    "description": "Learn the fundamentals and advanced applications of Feature engineering. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Feature engineering to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Interview Qs: Train test split",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Train test split. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Train test split to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Bias variance tradeoff",
                    "description": "Learn the fundamentals and advanced applications of Project: Bias variance tradeoff. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Bias variance tradeoff to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Linear algebra for ML",
                    "description": "Learn the fundamentals and advanced applications of Linear algebra for ML. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Linear algebra for ML to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Calculus and gradients",
                    "description": "Learn the fundamentals and advanced applications of Calculus and gradients. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Calculus and gradients to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Probability and statistics",
                    "description": "Learn the fundamentals and advanced applications of Probability and statistics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Probability and statistics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "NumPy operations",
                    "description": "Learn the fundamentals and advanced applications of NumPy operations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on NumPy operations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Matplotlib visualization",
                    "description": "Learn the fundamentals and advanced applications of Matplotlib visualization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Matplotlib visualization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Deep Dive: Linear algebra for ML",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Linear algebra for ML. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Linear algebra for ML to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "House price prediction",
                    "description": "Learn the fundamentals and advanced applications of House price prediction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on House price prediction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Image classifier",
                    "description": "Learn the fundamentals and advanced applications of Image classifier. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Image classifier to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Sentiment analysis",
                    "description": "Learn the fundamentals and advanced applications of Sentiment analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Sentiment analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Recommendation system",
                    "description": "Learn the fundamentals and advanced applications of Recommendation system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Recommendation system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Interview Qs: House price prediction",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: House price prediction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: House price prediction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Project: Sentiment analysis",
                    "description": "Learn the fundamentals and advanced applications of Project: Sentiment analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Sentiment analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "ML system design",
                    "description": "Learn the fundamentals and advanced applications of ML system design. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ML system design to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Common interview questions",
                    "description": "Learn the fundamentals and advanced applications of Common interview questions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Common interview questions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Case studies",
                    "description": "Learn the fundamentals and advanced applications of Case studies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Case studies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Portfolio building",
                    "description": "Learn the fundamentals and advanced applications of Portfolio building. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Portfolio building to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Practical Case studies",
                    "description": "Learn the fundamentals and advanced applications of Practical Case studies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Case studies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Interview Qs: Common interview questions",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Common interview questions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Common interview questions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Linear regression",
                    "description": "Learn the fundamentals and advanced applications of Linear regression. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Linear regression to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Logistic regression",
                    "description": "Learn the fundamentals and advanced applications of Logistic regression. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Logistic regression to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Decision trees",
                    "description": "Learn the fundamentals and advanced applications of Decision trees. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Decision trees to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Random forests",
                    "description": "Learn the fundamentals and advanced applications of Random forests. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Random forests to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "SVM and KNN",
                    "description": "Learn the fundamentals and advanced applications of SVM and KNN. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on SVM and KNN to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Advanced SVM and KNN",
                    "description": "Learn the fundamentals and advanced applications of Advanced SVM and KNN. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced SVM and KNN to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Interview Qs: Linear regression",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Linear regression. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Linear regression to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Pipeline building",
                    "description": "Learn the fundamentals and advanced applications of Pipeline building. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Pipeline building to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Preprocessing",
                    "description": "Learn the fundamentals and advanced applications of Preprocessing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Preprocessing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Model selection",
                    "description": "Learn the fundamentals and advanced applications of Model selection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model selection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "GridSearchCV",
                    "description": "Learn the fundamentals and advanced applications of GridSearchCV. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GridSearchCV to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Model evaluation metrics",
                    "description": "Learn the fundamentals and advanced applications of Model evaluation metrics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model evaluation metrics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Project: Pipeline building",
                    "description": "Learn the fundamentals and advanced applications of Project: Pipeline building. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Pipeline building to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Practical Model evaluation metrics",
                    "description": "Learn the fundamentals and advanced applications of Practical Model evaluation metrics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Model evaluation metrics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Perceptron and activation functions",
                    "description": "Learn the fundamentals and advanced applications of Perceptron and activation functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Perceptron and activation functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Backpropagation",
                    "description": "Learn the fundamentals and advanced applications of Backpropagation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Backpropagation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Keras and TensorFlow basics",
                    "description": "Learn the fundamentals and advanced applications of Keras and TensorFlow basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Keras and TensorFlow basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "CNN architecture",
                    "description": "Learn the fundamentals and advanced applications of CNN architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CNN architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "RNN and LSTM",
                    "description": "Learn the fundamentals and advanced applications of RNN and LSTM. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RNN and LSTM to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: RNN and LSTM",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: RNN and LSTM. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: RNN and LSTM to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Interview Qs: Keras and TensorFlow basics",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Keras and TensorFlow basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Keras and TensorFlow basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Transfer learning",
                    "description": "Learn the fundamentals and advanced applications of Transfer learning. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Transfer learning to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Fine tuning pretrained models",
                    "description": "Learn the fundamentals and advanced applications of Fine tuning pretrained models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Fine tuning pretrained models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Object detection with YOLO",
                    "description": "Learn the fundamentals and advanced applications of Object detection with YOLO. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Object detection with YOLO to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Image segmentation",
                    "description": "Learn the fundamentals and advanced applications of Image segmentation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Image segmentation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "GANs introduction",
                    "description": "Learn the fundamentals and advanced applications of GANs introduction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GANs introduction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Interview Qs: GANs introduction",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: GANs introduction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: GANs introduction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Project: GANs introduction",
                    "description": "Learn the fundamentals and advanced applications of Project: GANs introduction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: GANs introduction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Experiment tracking with MLflow",
                    "description": "Learn the fundamentals and advanced applications of Experiment tracking with MLflow. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Experiment tracking with MLflow to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Model serving with FastAPI",
                    "description": "Learn the fundamentals and advanced applications of Model serving with FastAPI. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model serving with FastAPI to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 15,
                    "topic": "Docker for ML",
                    "description": "Learn the fundamentals and advanced applications of Docker for ML. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker for ML to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Model monitoring",
                    "description": "Learn the fundamentals and advanced applications of Model monitoring. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model monitoring to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "A/B testing models",
                    "description": "Learn the fundamentals and advanced applications of A/B testing models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on A/B testing models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Practical A/B testing models",
                    "description": "Learn the fundamentals and advanced applications of Practical A/B testing models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical A/B testing models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 16,
                    "topic": "Interview Qs: Experiment tracking with MLflow",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Experiment tracking with MLflow. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Experiment tracking with MLflow to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "nlp": {
        id: "nlp",
        title: "Natural Language Processing",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "14 weeks",
        level: "advanced",
        difficulty: "Advanced",
        icon: "📊",
        color: "from-yellow-400 to-orange-500",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Natural","Problem Solving","Architecture"],
        careerOutcomes: ["Natural Language Processing"],
        chapters: [
            {
                id: "ch1-nlp",
                title: "Advanced NLP",
                description: "Master the concepts of Advanced NLP",
                estimatedHours: 17,
                topics: [
                    { id: "topic_406", title: "Question answering systems", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_407", title: "Text summarization", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_408", title: "Machine translation", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_409", title: "Chatbot development", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_410", title: "RAG systems", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_411", title: "Interview Qs: Chatbot development", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_412", title: "Deep Dive: Machine translation", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch2-nlp",
                title: "Transformers",
                description: "Master the concepts of Transformers",
                estimatedHours: 14,
                topics: [
                    { id: "topic_413", title: "Transformer architecture", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_414", title: "BERT and variants", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_415", title: "GPT architecture", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_416", title: "Fine tuning pretrained models", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_417", title: "Hugging Face library", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_418", title: "Interview Qs: BERT and variants", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch3-nlp",
                title: "Deep Learning for NLP",
                description: "Master the concepts of Deep Learning for NLP",
                estimatedHours: 15,
                topics: [
                    { id: "topic_419", title: "RNNs for sequences", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_420", title: "LSTMs and GRUs", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_421", title: "Attention mechanism", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_422", title: "Seq2Seq models", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_423", title: "Beam search", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_424", title: "Deep Dive: Attention mechanism", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch4-nlp",
                title: "Classical NLP",
                description: "Master the concepts of Classical NLP",
                estimatedHours: 19,
                topics: [
                    { id: "topic_425", title: "Naive Bayes classifier", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_426", title: "Sentiment analysis", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_427", title: "Named entity recognition", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_428", title: "POS tagging", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_429", title: "Text classification", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_430", title: "Project: Text classification", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch5-nlp",
                title: "Text Representation",
                description: "Master the concepts of Text Representation",
                estimatedHours: 12,
                topics: [
                    { id: "topic_431", title: "Bag of words", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_432", title: "TF-IDF", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_433", title: "Word2Vec", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_434", title: "GloVe embeddings", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_435", title: "FastText", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_436", title: "Deep Dive: Word2Vec", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch6-nlp",
                title: "NLP Foundations",
                description: "Master the concepts of NLP Foundations",
                estimatedHours: 16,
                topics: [
                    { id: "topic_437", title: "Text preprocessing", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_438", title: "Tokenization", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_439", title: "Stemming and lemmatization", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_440", title: "Stop words", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_441", title: "Regular expressions for text", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_442", title: "Deep Dive: Stemming and lemmatization", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch7-nlp",
                title: "Projects",
                description: "Master the concepts of Projects",
                estimatedHours: 13,
                topics: [
                    { id: "topic_443", title: "Sentiment analyzer", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_444", title: "Text summarizer", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_445", title: "Question answering bot", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_446", title: "Document search system", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_447", title: "Deep Dive: Document search system", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_448", title: "Practical Question answering bot", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch8-nlp",
                title: "Production NLP",
                description: "Master the concepts of Production NLP",
                estimatedHours: 19,
                topics: [
                    { id: "topic_449", title: "Serving NLP models", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_450", title: "Latency optimization", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_451", title: "Vector databases", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_452", title: "LangChain basics", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_453", title: "Building AI applications", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_454", title: "Practical Building AI applications", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ },
                    { id: "topic_455", title: "Interview Qs: Building AI applications", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/rmVRLeJRpdo" /* freeCodeCamp */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Question answering systems",
                    "description": "Learn the fundamentals and advanced applications of Question answering systems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Question answering systems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Text summarization",
                    "description": "Learn the fundamentals and advanced applications of Text summarization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Text summarization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Machine translation",
                    "description": "Learn the fundamentals and advanced applications of Machine translation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Machine translation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Chatbot development",
                    "description": "Learn the fundamentals and advanced applications of Chatbot development. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Chatbot development to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "RAG systems",
                    "description": "Learn the fundamentals and advanced applications of RAG systems. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RAG systems to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Interview Qs: Chatbot development",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Chatbot development. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Chatbot development to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Machine translation",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Machine translation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Machine translation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Transformer architecture",
                    "description": "Learn the fundamentals and advanced applications of Transformer architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Transformer architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "BERT and variants",
                    "description": "Learn the fundamentals and advanced applications of BERT and variants. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on BERT and variants to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "GPT architecture",
                    "description": "Learn the fundamentals and advanced applications of GPT architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GPT architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Fine tuning pretrained models",
                    "description": "Learn the fundamentals and advanced applications of Fine tuning pretrained models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Fine tuning pretrained models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Hugging Face library",
                    "description": "Learn the fundamentals and advanced applications of Hugging Face library. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hugging Face library to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: BERT and variants",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: BERT and variants. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: BERT and variants to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "RNNs for sequences",
                    "description": "Learn the fundamentals and advanced applications of RNNs for sequences. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RNNs for sequences to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "LSTMs and GRUs",
                    "description": "Learn the fundamentals and advanced applications of LSTMs and GRUs. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on LSTMs and GRUs to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Attention mechanism",
                    "description": "Learn the fundamentals and advanced applications of Attention mechanism. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Attention mechanism to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Seq2Seq models",
                    "description": "Learn the fundamentals and advanced applications of Seq2Seq models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Seq2Seq models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Beam search",
                    "description": "Learn the fundamentals and advanced applications of Beam search. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Beam search to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Deep Dive: Attention mechanism",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Attention mechanism. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Attention mechanism to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Naive Bayes classifier",
                    "description": "Learn the fundamentals and advanced applications of Naive Bayes classifier. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Naive Bayes classifier to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Sentiment analysis",
                    "description": "Learn the fundamentals and advanced applications of Sentiment analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Sentiment analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Named entity recognition",
                    "description": "Learn the fundamentals and advanced applications of Named entity recognition. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Named entity recognition to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "POS tagging",
                    "description": "Learn the fundamentals and advanced applications of POS tagging. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on POS tagging to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Text classification",
                    "description": "Learn the fundamentals and advanced applications of Text classification. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Text classification to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Project: Text classification",
                    "description": "Learn the fundamentals and advanced applications of Project: Text classification. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Text classification to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Bag of words",
                    "description": "Learn the fundamentals and advanced applications of Bag of words. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bag of words to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "TF-IDF",
                    "description": "Learn the fundamentals and advanced applications of TF-IDF. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on TF-IDF to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Word2Vec",
                    "description": "Learn the fundamentals and advanced applications of Word2Vec. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Word2Vec to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "GloVe embeddings",
                    "description": "Learn the fundamentals and advanced applications of GloVe embeddings. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GloVe embeddings to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "FastText",
                    "description": "Learn the fundamentals and advanced applications of FastText. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on FastText to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: Word2Vec",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Word2Vec. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Word2Vec to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Text preprocessing",
                    "description": "Learn the fundamentals and advanced applications of Text preprocessing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Text preprocessing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Tokenization",
                    "description": "Learn the fundamentals and advanced applications of Tokenization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Tokenization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Stemming and lemmatization",
                    "description": "Learn the fundamentals and advanced applications of Stemming and lemmatization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Stemming and lemmatization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Stop words",
                    "description": "Learn the fundamentals and advanced applications of Stop words. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Stop words to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Regular expressions for text",
                    "description": "Learn the fundamentals and advanced applications of Regular expressions for text. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Regular expressions for text to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Deep Dive: Stemming and lemmatization",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Stemming and lemmatization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Stemming and lemmatization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Sentiment analyzer",
                    "description": "Learn the fundamentals and advanced applications of Sentiment analyzer. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Sentiment analyzer to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Text summarizer",
                    "description": "Learn the fundamentals and advanced applications of Text summarizer. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Text summarizer to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Question answering bot",
                    "description": "Learn the fundamentals and advanced applications of Question answering bot. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Question answering bot to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Document search system",
                    "description": "Learn the fundamentals and advanced applications of Document search system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Document search system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: Document search system",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Document search system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Document search system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Practical Question answering bot",
                    "description": "Learn the fundamentals and advanced applications of Practical Question answering bot. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Question answering bot to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Serving NLP models",
                    "description": "Learn the fundamentals and advanced applications of Serving NLP models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Serving NLP models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Latency optimization",
                    "description": "Learn the fundamentals and advanced applications of Latency optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Latency optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Vector databases",
                    "description": "Learn the fundamentals and advanced applications of Vector databases. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Vector databases to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "LangChain basics",
                    "description": "Learn the fundamentals and advanced applications of LangChain basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on LangChain basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Building AI applications",
                    "description": "Learn the fundamentals and advanced applications of Building AI applications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Building AI applications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Practical Building AI applications",
                    "description": "Learn the fundamentals and advanced applications of Practical Building AI applications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Building AI applications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Interview Qs: Building AI applications",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Building AI applications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Building AI applications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "data-science": {
        id: "data-science",
        title: "Data Science with Python",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "📱",
        color: "from-purple-500 to-indigo-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Data","Problem Solving","Architecture"],
        careerOutcomes: ["Data Science with Python"],
        chapters: [
            {
                id: "ch1-data-science",
                title: "Machine Learning for DS",
                description: "Master the concepts of Machine Learning for DS",
                estimatedHours: 17,
                topics: [
                    { id: "topic_456", title: "Regression models", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_457", title: "Classification models", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_458", title: "Clustering with KMeans", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_459", title: "Dimensionality reduction PCA", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_460", title: "Model evaluation", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_461", title: "Practical Classification models", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_462", title: "Deep Dive: Classification models", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch2-data-science",
                title: "Statistical Analysis",
                description: "Master the concepts of Statistical Analysis",
                estimatedHours: 16,
                topics: [
                    { id: "topic_463", title: "Hypothesis testing", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_464", title: "T-tests and ANOVA", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_465", title: "Chi-square tests", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_466", title: "Confidence intervals", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_467", title: "A/B testing", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_468", title: "Advanced T-tests and ANOVA", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch3-data-science",
                title: "Exploratory Analysis",
                description: "Master the concepts of Exploratory Analysis",
                estimatedHours: 10,
                topics: [
                    { id: "topic_469", title: "Descriptive statistics", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_470", title: "Correlation analysis", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_471", title: "Matplotlib plots", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_472", title: "Seaborn visualizations", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_473", title: "Plotly interactive charts", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_474", title: "Deep Dive: Correlation analysis", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch4-data-science",
                title: "Data Cleaning",
                description: "Master the concepts of Data Cleaning",
                estimatedHours: 14,
                topics: [
                    { id: "topic_475", title: "Handling missing values", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_476", title: "Outlier detection", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_477", title: "Data type conversion", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_478", title: "String cleaning", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_479", title: "Merging and joining datasets", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_480", title: "Advanced Outlier detection", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch5-data-science",
                title: "Python for Data",
                description: "Master the concepts of Python for Data",
                estimatedHours: 14,
                topics: [
                    { id: "topic_481", title: "Python review", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_482", title: "NumPy arrays", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_483", title: "Pandas DataFrames", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_484", title: "Data loading and export", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_485", title: "Jupyter notebooks", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_486", title: "Project: Pandas DataFrames", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch6-data-science",
                title: "SQL for Data Science",
                description: "Master the concepts of SQL for Data Science",
                estimatedHours: 17,
                topics: [
                    { id: "topic_487", title: "SQL fundamentals", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_488", title: "Joins and aggregations", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_489", title: "Window functions", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_490", title: "CTEs", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_491", title: "Connecting Python to SQL", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_492", title: "Advanced Connecting Python to SQL", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_493", title: "Interview Qs: SQL fundamentals", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch7-data-science",
                title: "Projects and Portfolio",
                description: "Master the concepts of Projects and Portfolio",
                estimatedHours: 13,
                topics: [
                    { id: "topic_494", title: "End to end project workflow", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_495", title: "Kaggle competitions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_496", title: "Storytelling with data", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_497", title: "Building a portfolio", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_498", title: "Interview preparation", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_499", title: "Advanced Kaggle competitions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ },
                    { id: "topic_500", title: "Advanced Storytelling with data", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8" /* freeCodeCamp */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Regression models",
                    "description": "Learn the fundamentals and advanced applications of Regression models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Regression models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Classification models",
                    "description": "Learn the fundamentals and advanced applications of Classification models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Classification models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Clustering with KMeans",
                    "description": "Learn the fundamentals and advanced applications of Clustering with KMeans. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Clustering with KMeans to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Dimensionality reduction PCA",
                    "description": "Learn the fundamentals and advanced applications of Dimensionality reduction PCA. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dimensionality reduction PCA to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Model evaluation",
                    "description": "Learn the fundamentals and advanced applications of Model evaluation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Model evaluation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Classification models",
                    "description": "Learn the fundamentals and advanced applications of Practical Classification models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Classification models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Classification models",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Classification models. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Classification models to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Hypothesis testing",
                    "description": "Learn the fundamentals and advanced applications of Hypothesis testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hypothesis testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "T-tests and ANOVA",
                    "description": "Learn the fundamentals and advanced applications of T-tests and ANOVA. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on T-tests and ANOVA to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Chi-square tests",
                    "description": "Learn the fundamentals and advanced applications of Chi-square tests. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Chi-square tests to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Confidence intervals",
                    "description": "Learn the fundamentals and advanced applications of Confidence intervals. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Confidence intervals to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "A/B testing",
                    "description": "Learn the fundamentals and advanced applications of A/B testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on A/B testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Advanced T-tests and ANOVA",
                    "description": "Learn the fundamentals and advanced applications of Advanced T-tests and ANOVA. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced T-tests and ANOVA to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Descriptive statistics",
                    "description": "Learn the fundamentals and advanced applications of Descriptive statistics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Descriptive statistics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Correlation analysis",
                    "description": "Learn the fundamentals and advanced applications of Correlation analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Correlation analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Matplotlib plots",
                    "description": "Learn the fundamentals and advanced applications of Matplotlib plots. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Matplotlib plots to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Seaborn visualizations",
                    "description": "Learn the fundamentals and advanced applications of Seaborn visualizations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Seaborn visualizations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Plotly interactive charts",
                    "description": "Learn the fundamentals and advanced applications of Plotly interactive charts. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Plotly interactive charts to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Deep Dive: Correlation analysis",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Correlation analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Correlation analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Handling missing values",
                    "description": "Learn the fundamentals and advanced applications of Handling missing values. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Handling missing values to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Outlier detection",
                    "description": "Learn the fundamentals and advanced applications of Outlier detection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Outlier detection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Data type conversion",
                    "description": "Learn the fundamentals and advanced applications of Data type conversion. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Data type conversion to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "String cleaning",
                    "description": "Learn the fundamentals and advanced applications of String cleaning. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on String cleaning to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Merging and joining datasets",
                    "description": "Learn the fundamentals and advanced applications of Merging and joining datasets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Merging and joining datasets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Advanced Outlier detection",
                    "description": "Learn the fundamentals and advanced applications of Advanced Outlier detection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Outlier detection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Python review",
                    "description": "Learn the fundamentals and advanced applications of Python review. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Python review to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "NumPy arrays",
                    "description": "Learn the fundamentals and advanced applications of NumPy arrays. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on NumPy arrays to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Pandas DataFrames",
                    "description": "Learn the fundamentals and advanced applications of Pandas DataFrames. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Pandas DataFrames to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Data loading and export",
                    "description": "Learn the fundamentals and advanced applications of Data loading and export. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Data loading and export to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Jupyter notebooks",
                    "description": "Learn the fundamentals and advanced applications of Jupyter notebooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Jupyter notebooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Project: Pandas DataFrames",
                    "description": "Learn the fundamentals and advanced applications of Project: Pandas DataFrames. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Pandas DataFrames to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "SQL fundamentals",
                    "description": "Learn the fundamentals and advanced applications of SQL fundamentals. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on SQL fundamentals to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Joins and aggregations",
                    "description": "Learn the fundamentals and advanced applications of Joins and aggregations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Joins and aggregations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Window functions",
                    "description": "Learn the fundamentals and advanced applications of Window functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Window functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "CTEs",
                    "description": "Learn the fundamentals and advanced applications of CTEs. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CTEs to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Connecting Python to SQL",
                    "description": "Learn the fundamentals and advanced applications of Connecting Python to SQL. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Connecting Python to SQL to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Advanced Connecting Python to SQL",
                    "description": "Learn the fundamentals and advanced applications of Advanced Connecting Python to SQL. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Connecting Python to SQL to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Interview Qs: SQL fundamentals",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: SQL fundamentals. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: SQL fundamentals to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "End to end project workflow",
                    "description": "Learn the fundamentals and advanced applications of End to end project workflow. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on End to end project workflow to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Kaggle competitions",
                    "description": "Learn the fundamentals and advanced applications of Kaggle competitions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Kaggle competitions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Storytelling with data",
                    "description": "Learn the fundamentals and advanced applications of Storytelling with data. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Storytelling with data to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Building a portfolio",
                    "description": "Learn the fundamentals and advanced applications of Building a portfolio. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Building a portfolio to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Interview preparation",
                    "description": "Learn the fundamentals and advanced applications of Interview preparation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview preparation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced Kaggle competitions",
                    "description": "Learn the fundamentals and advanced applications of Advanced Kaggle competitions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Kaggle competitions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced Storytelling with data",
                    "description": "Learn the fundamentals and advanced applications of Advanced Storytelling with data. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Storytelling with data to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "flutter": {
        id: "flutter",
        title: "Flutter Developer",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "beginner",
        difficulty: "Beginner",
        icon: "⚓",
        color: "from-emerald-400 to-green-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Flutter","Problem Solving","Architecture"],
        careerOutcomes: ["Flutter Developer"],
        chapters: [
            {
                id: "ch1-flutter",
                title: "Firebase Integration",
                description: "Master the concepts of Firebase Integration",
                estimatedHours: 18,
                topics: [
                    { id: "topic_501", title: "Authentication", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_502", title: "Firestore CRUD", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_503", title: "Storage", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_504", title: "FCM notifications", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_505", title: "Crashlytics", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_506", title: "Project: Crashlytics", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_507", title: "Interview Qs: Authentication", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch2-flutter",
                title: "State Management",
                description: "Master the concepts of State Management",
                estimatedHours: 19,
                topics: [
                    { id: "topic_508", title: "setState basics", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_509", title: "Provider pattern", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_510", title: "Riverpod", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_511", title: "BLoC and Cubit", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_512", title: "GetX", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_513", title: "Interview Qs: Riverpod", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch3-flutter",
                title: "Flutter Basics",
                description: "Master the concepts of Flutter Basics",
                estimatedHours: 10,
                topics: [
                    { id: "topic_514", title: "Widget tree and BuildContext", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_515", title: "Stateless vs Stateful", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_516", title: "Material and Cupertino widgets", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_517", title: "Layout widgets", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_518", title: "Navigation", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_519", title: "Deep Dive: Layout widgets", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch4-flutter",
                title: "Dart Language",
                description: "Master the concepts of Dart Language",
                estimatedHours: 12,
                topics: [
                    { id: "topic_520", title: "Dart syntax and variables", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_521", title: "Control flow", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_522", title: "Functions and closures", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_523", title: "OOP in Dart", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_524", title: "Null safety and async", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_525", title: "Practical Null safety and async", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch5-flutter",
                title: "Final Project",
                description: "Master the concepts of Final Project",
                estimatedHours: 19,
                topics: [
                    { id: "topic_526", title: "Full social app with auth posts and real time chat", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_527", title: "Project: Full social app with auth posts and real time chat", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_528", title: "Interview Qs: Full social app with auth posts and real time chat", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_529", title: "Practical Full social app with auth posts and real time chat", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_530", title: "Deep Dive: Full social app with auth posts and real time chat", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_531", title: "Advanced Full social app with auth posts and real time chat", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch6-flutter",
                title: "Advanced UI",
                description: "Master the concepts of Advanced UI",
                estimatedHours: 12,
                topics: [
                    { id: "topic_532", title: "Custom painting", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_533", title: "Animations", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_534", title: "Hero transitions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_535", title: "Responsive design", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_536", title: "Themes and dark mode", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_537", title: "Practical Animations", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_538", title: "Project: Animations", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            },
            {
                id: "ch7-flutter",
                title: "Production",
                description: "Master the concepts of Production",
                estimatedHours: 10,
                topics: [
                    { id: "topic_539", title: "REST API with Dio", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_540", title: "Local storage with Hive", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_541", title: "Unit and widget testing", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_542", title: "Play Store deployment", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_543", title: "iOS deployment", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_544", title: "Project: iOS deployment", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ },
                    { id: "topic_545", title: "Advanced iOS deployment", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/jmsN7dn9iWk" /* Rivaan Ranawat */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Authentication",
                    "description": "Learn the fundamentals and advanced applications of Authentication. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Authentication to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Firestore CRUD",
                    "description": "Learn the fundamentals and advanced applications of Firestore CRUD. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Firestore CRUD to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Storage",
                    "description": "Learn the fundamentals and advanced applications of Storage. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Storage to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "FCM notifications",
                    "description": "Learn the fundamentals and advanced applications of FCM notifications. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on FCM notifications to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Crashlytics",
                    "description": "Learn the fundamentals and advanced applications of Crashlytics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Crashlytics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Crashlytics",
                    "description": "Learn the fundamentals and advanced applications of Project: Crashlytics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Crashlytics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Interview Qs: Authentication",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Authentication. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Authentication to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "setState basics",
                    "description": "Learn the fundamentals and advanced applications of setState basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on setState basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Provider pattern",
                    "description": "Learn the fundamentals and advanced applications of Provider pattern. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Provider pattern to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Riverpod",
                    "description": "Learn the fundamentals and advanced applications of Riverpod. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Riverpod to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "BLoC and Cubit",
                    "description": "Learn the fundamentals and advanced applications of BLoC and Cubit. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on BLoC and Cubit to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "GetX",
                    "description": "Learn the fundamentals and advanced applications of GetX. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GetX to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: Riverpod",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Riverpod. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Riverpod to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Widget tree and BuildContext",
                    "description": "Learn the fundamentals and advanced applications of Widget tree and BuildContext. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Widget tree and BuildContext to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Stateless vs Stateful",
                    "description": "Learn the fundamentals and advanced applications of Stateless vs Stateful. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Stateless vs Stateful to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Material and Cupertino widgets",
                    "description": "Learn the fundamentals and advanced applications of Material and Cupertino widgets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Material and Cupertino widgets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Layout widgets",
                    "description": "Learn the fundamentals and advanced applications of Layout widgets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Layout widgets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Navigation",
                    "description": "Learn the fundamentals and advanced applications of Navigation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Navigation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Deep Dive: Layout widgets",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Layout widgets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Layout widgets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Dart syntax and variables",
                    "description": "Learn the fundamentals and advanced applications of Dart syntax and variables. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dart syntax and variables to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Control flow",
                    "description": "Learn the fundamentals and advanced applications of Control flow. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Control flow to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Functions and closures",
                    "description": "Learn the fundamentals and advanced applications of Functions and closures. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Functions and closures to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "OOP in Dart",
                    "description": "Learn the fundamentals and advanced applications of OOP in Dart. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OOP in Dart to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Null safety and async",
                    "description": "Learn the fundamentals and advanced applications of Null safety and async. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Null safety and async to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Practical Null safety and async",
                    "description": "Learn the fundamentals and advanced applications of Practical Null safety and async. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Null safety and async to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Project: Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Project: Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Interview Qs: Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Practical Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Practical Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Deep Dive: Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Advanced Full social app with auth posts and real time chat",
                    "description": "Learn the fundamentals and advanced applications of Advanced Full social app with auth posts and real time chat. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Full social app with auth posts and real time chat to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Custom painting",
                    "description": "Learn the fundamentals and advanced applications of Custom painting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Custom painting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Animations",
                    "description": "Learn the fundamentals and advanced applications of Animations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Animations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Hero transitions",
                    "description": "Learn the fundamentals and advanced applications of Hero transitions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hero transitions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Responsive design",
                    "description": "Learn the fundamentals and advanced applications of Responsive design. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Responsive design to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Themes and dark mode",
                    "description": "Learn the fundamentals and advanced applications of Themes and dark mode. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Themes and dark mode to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Practical Animations",
                    "description": "Learn the fundamentals and advanced applications of Practical Animations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Animations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Project: Animations",
                    "description": "Learn the fundamentals and advanced applications of Project: Animations. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Animations to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "REST API with Dio",
                    "description": "Learn the fundamentals and advanced applications of REST API with Dio. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on REST API with Dio to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Local storage with Hive",
                    "description": "Learn the fundamentals and advanced applications of Local storage with Hive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Local storage with Hive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Unit and widget testing",
                    "description": "Learn the fundamentals and advanced applications of Unit and widget testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Unit and widget testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Play Store deployment",
                    "description": "Learn the fundamentals and advanced applications of Play Store deployment. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Play Store deployment to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "iOS deployment",
                    "description": "Learn the fundamentals and advanced applications of iOS deployment. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on iOS deployment to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Project: iOS deployment",
                    "description": "Learn the fundamentals and advanced applications of Project: iOS deployment. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: iOS deployment to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced iOS deployment",
                    "description": "Learn the fundamentals and advanced applications of Advanced iOS deployment. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced iOS deployment to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "react-native": {
        id: "react-native",
        title: "React Native Developer",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "10 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "☁️",
        color: "from-pink-500 to-rose-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["React","Problem Solving","Architecture"],
        careerOutcomes: ["React Native Developer"],
        chapters: [
            {
                id: "ch1-react-native",
                title: "Performance",
                description: "Master the concepts of Performance",
                estimatedHours: 11,
                topics: [
                    { id: "topic_546", title: "FlatList optimization", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_547", title: "Memo and callbacks", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_548", title: "Hermes engine", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_549", title: "Bundle size reduction", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_550", title: "Profiling tools", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_551", title: "Advanced Bundle size reduction", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch2-react-native",
                title: "Deployment",
                description: "Master the concepts of Deployment",
                estimatedHours: 12,
                topics: [
                    { id: "topic_552", title: "TestFlight for iOS", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_553", title: "Play Store for Android", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_554", title: "EAS Build", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_555", title: "OTA updates", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_556", title: "App store optimization", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch3-react-native",
                title: "Native Features",
                description: "Master the concepts of Native Features",
                estimatedHours: 11,
                topics: [
                    { id: "topic_557", title: "Camera and gallery", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_558", title: "Location services", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_559", title: "Push notifications with Expo", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_560", title: "Biometric auth", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_561", title: "File system", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_562", title: "Project: Biometric auth", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch4-react-native",
                title: "State and Data",
                description: "Master the concepts of State and Data",
                estimatedHours: 13,
                topics: [
                    { id: "topic_563", title: "Context API", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_564", title: "Redux Toolkit", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_565", title: "AsyncStorage", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_566", title: "Fetch and Axios", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_567", title: "React Query", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_568", title: "Practical React Query", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch5-react-native",
                title: "Navigation",
                description: "Master the concepts of Navigation",
                estimatedHours: 15,
                topics: [
                    { id: "topic_569", title: "React Navigation v6", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_570", title: "Stack navigator", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_571", title: "Tab navigator", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_572", title: "Drawer navigator", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_573", title: "Deep linking", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_574", title: "Project: Drawer navigator", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            },
            {
                id: "ch6-react-native",
                title: "RN Foundations",
                description: "Master the concepts of RN Foundations",
                estimatedHours: 10,
                topics: [
                    { id: "topic_575", title: "Expo setup", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_576", title: "Core components", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_577", title: "Styling with StyleSheet", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_578", title: "Flexbox layout", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_579", title: "Platform specific code", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ },
                    { id: "topic_580", title: "Practical Platform specific code", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc" /* Traversy Media */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "FlatList optimization",
                    "description": "Learn the fundamentals and advanced applications of FlatList optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on FlatList optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Memo and callbacks",
                    "description": "Learn the fundamentals and advanced applications of Memo and callbacks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Memo and callbacks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Hermes engine",
                    "description": "Learn the fundamentals and advanced applications of Hermes engine. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hermes engine to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Bundle size reduction",
                    "description": "Learn the fundamentals and advanced applications of Bundle size reduction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bundle size reduction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Profiling tools",
                    "description": "Learn the fundamentals and advanced applications of Profiling tools. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Profiling tools to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Advanced Bundle size reduction",
                    "description": "Learn the fundamentals and advanced applications of Advanced Bundle size reduction. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Bundle size reduction to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "TestFlight for iOS",
                    "description": "Learn the fundamentals and advanced applications of TestFlight for iOS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on TestFlight for iOS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Play Store for Android",
                    "description": "Learn the fundamentals and advanced applications of Play Store for Android. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Play Store for Android to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "EAS Build",
                    "description": "Learn the fundamentals and advanced applications of EAS Build. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on EAS Build to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "OTA updates",
                    "description": "Learn the fundamentals and advanced applications of OTA updates. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OTA updates to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "App store optimization",
                    "description": "Learn the fundamentals and advanced applications of App store optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on App store optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Camera and gallery",
                    "description": "Learn the fundamentals and advanced applications of Camera and gallery. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Camera and gallery to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Location services",
                    "description": "Learn the fundamentals and advanced applications of Location services. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Location services to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Push notifications with Expo",
                    "description": "Learn the fundamentals and advanced applications of Push notifications with Expo. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Push notifications with Expo to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Biometric auth",
                    "description": "Learn the fundamentals and advanced applications of Biometric auth. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Biometric auth to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "File system",
                    "description": "Learn the fundamentals and advanced applications of File system. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File system to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Project: Biometric auth",
                    "description": "Learn the fundamentals and advanced applications of Project: Biometric auth. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Biometric auth to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Context API",
                    "description": "Learn the fundamentals and advanced applications of Context API. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Context API to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Redux Toolkit",
                    "description": "Learn the fundamentals and advanced applications of Redux Toolkit. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Redux Toolkit to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "AsyncStorage",
                    "description": "Learn the fundamentals and advanced applications of AsyncStorage. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on AsyncStorage to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Fetch and Axios",
                    "description": "Learn the fundamentals and advanced applications of Fetch and Axios. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Fetch and Axios to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "React Query",
                    "description": "Learn the fundamentals and advanced applications of React Query. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React Query to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Practical React Query",
                    "description": "Learn the fundamentals and advanced applications of Practical React Query. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical React Query to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "React Navigation v6",
                    "description": "Learn the fundamentals and advanced applications of React Navigation v6. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on React Navigation v6 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Stack navigator",
                    "description": "Learn the fundamentals and advanced applications of Stack navigator. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Stack navigator to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Tab navigator",
                    "description": "Learn the fundamentals and advanced applications of Tab navigator. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Tab navigator to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Drawer navigator",
                    "description": "Learn the fundamentals and advanced applications of Drawer navigator. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Drawer navigator to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Deep linking",
                    "description": "Learn the fundamentals and advanced applications of Deep linking. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep linking to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Project: Drawer navigator",
                    "description": "Learn the fundamentals and advanced applications of Project: Drawer navigator. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Drawer navigator to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Expo setup",
                    "description": "Learn the fundamentals and advanced applications of Expo setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Expo setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Core components",
                    "description": "Learn the fundamentals and advanced applications of Core components. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Core components to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Styling with StyleSheet",
                    "description": "Learn the fundamentals and advanced applications of Styling with StyleSheet. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Styling with StyleSheet to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Flexbox layout",
                    "description": "Learn the fundamentals and advanced applications of Flexbox layout. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Flexbox layout to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Platform specific code",
                    "description": "Learn the fundamentals and advanced applications of Platform specific code. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Platform specific code to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Practical Platform specific code",
                    "description": "Learn the fundamentals and advanced applications of Practical Platform specific code. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Platform specific code to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "android-kotlin": {
        id: "android-kotlin",
        title: "Android Developer Kotlin",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "14 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "🛡️",
        color: "from-cyan-400 to-blue-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Android","Problem Solving","Architecture"],
        careerOutcomes: ["Android Developer Kotlin"],
        chapters: [
            {
                id: "ch1-android-kotlin",
                title: "Advanced",
                description: "Master the concepts of Advanced",
                estimatedHours: 16,
                topics: [
                    { id: "topic_581", title: "Custom views", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_582", title: "Canvas drawing", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_583", title: "Animations with Compose", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_584", title: "Maps integration", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_585", title: "Firebase for Android", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_586", title: "Project: Canvas drawing", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_587", title: "Deep Dive: Animations with Compose", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch2-android-kotlin",
                title: "Networking",
                description: "Master the concepts of Networking",
                estimatedHours: 11,
                topics: [
                    { id: "topic_588", title: "Retrofit and OkHttp", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_589", title: "Kotlin serialization", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_590", title: "Flow for reactive streams", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_591", title: "Paging 3", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_592", title: "Offline first architecture", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_593", title: "Advanced Retrofit and OkHttp", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch3-android-kotlin",
                title: "Data Persistence",
                description: "Master the concepts of Data Persistence",
                estimatedHours: 12,
                topics: [
                    { id: "topic_594", title: "Room database", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_595", title: "DataStore preferences", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_596", title: "File storage", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_597", title: "WorkManager", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_598", title: "Background tasks", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_599", title: "Practical Room database", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch4-android-kotlin",
                title: "Architecture",
                description: "Master the concepts of Architecture",
                estimatedHours: 15,
                topics: [
                    { id: "topic_600", title: "MVVM pattern", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_601", title: "ViewModel and LiveData", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_602", title: "Repository pattern", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_603", title: "Hilt dependency injection", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_604", title: "Clean architecture", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_605", title: "Practical Repository pattern", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch5-android-kotlin",
                title: "Jetpack Compose",
                description: "Master the concepts of Jetpack Compose",
                estimatedHours: 13,
                topics: [
                    { id: "topic_606", title: "Composable functions", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_607", title: "State in Compose", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_608", title: "Layouts and modifiers", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_609", title: "Navigation Compose", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_610", title: "Theming", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_611", title: "Practical Layouts and modifiers", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch6-android-kotlin",
                title: "Android Fundamentals",
                description: "Master the concepts of Android Fundamentals",
                estimatedHours: 14,
                topics: [
                    { id: "topic_612", title: "Activity and Fragment", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_613", title: "Intents", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_614", title: "Permissions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_615", title: "RecyclerView", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_616", title: "ViewBinding", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_617", title: "Project: RecyclerView", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch7-android-kotlin",
                title: "Kotlin Basics",
                description: "Master the concepts of Kotlin Basics",
                estimatedHours: 15,
                topics: [
                    { id: "topic_618", title: "Kotlin syntax", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_619", title: "Null safety", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_620", title: "Data classes", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_621", title: "Extension functions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_622", title: "Coroutines basics", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_623", title: "Deep Dive: Kotlin syntax", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            },
            {
                id: "ch8-android-kotlin",
                title: "Publishing",
                description: "Master the concepts of Publishing",
                estimatedHours: 15,
                topics: [
                    { id: "topic_624", title: "Signing APK", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_625", title: "Play Store listing", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_626", title: "In-app purchases", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_627", title: "App bundle optimization", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_628", title: "Crash reporting", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_629", title: "Deep Dive: App bundle optimization", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ },
                    { id: "topic_630", title: "Practical Crash reporting", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/cDabx3SjuOY" /* freeCodeCamp */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Custom views",
                    "description": "Learn the fundamentals and advanced applications of Custom views. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Custom views to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Canvas drawing",
                    "description": "Learn the fundamentals and advanced applications of Canvas drawing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Canvas drawing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Animations with Compose",
                    "description": "Learn the fundamentals and advanced applications of Animations with Compose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Animations with Compose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Maps integration",
                    "description": "Learn the fundamentals and advanced applications of Maps integration. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Maps integration to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Firebase for Android",
                    "description": "Learn the fundamentals and advanced applications of Firebase for Android. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Firebase for Android to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Project: Canvas drawing",
                    "description": "Learn the fundamentals and advanced applications of Project: Canvas drawing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Canvas drawing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Animations with Compose",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Animations with Compose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Animations with Compose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Retrofit and OkHttp",
                    "description": "Learn the fundamentals and advanced applications of Retrofit and OkHttp. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Retrofit and OkHttp to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Kotlin serialization",
                    "description": "Learn the fundamentals and advanced applications of Kotlin serialization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Kotlin serialization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Flow for reactive streams",
                    "description": "Learn the fundamentals and advanced applications of Flow for reactive streams. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Flow for reactive streams to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Paging 3",
                    "description": "Learn the fundamentals and advanced applications of Paging 3. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Paging 3 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Offline first architecture",
                    "description": "Learn the fundamentals and advanced applications of Offline first architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Offline first architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Advanced Retrofit and OkHttp",
                    "description": "Learn the fundamentals and advanced applications of Advanced Retrofit and OkHttp. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Retrofit and OkHttp to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Room database",
                    "description": "Learn the fundamentals and advanced applications of Room database. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Room database to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "DataStore preferences",
                    "description": "Learn the fundamentals and advanced applications of DataStore preferences. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DataStore preferences to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "File storage",
                    "description": "Learn the fundamentals and advanced applications of File storage. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File storage to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "WorkManager",
                    "description": "Learn the fundamentals and advanced applications of WorkManager. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on WorkManager to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Background tasks",
                    "description": "Learn the fundamentals and advanced applications of Background tasks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Background tasks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Practical Room database",
                    "description": "Learn the fundamentals and advanced applications of Practical Room database. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Room database to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "MVVM pattern",
                    "description": "Learn the fundamentals and advanced applications of MVVM pattern. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on MVVM pattern to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "ViewModel and LiveData",
                    "description": "Learn the fundamentals and advanced applications of ViewModel and LiveData. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ViewModel and LiveData to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Repository pattern",
                    "description": "Learn the fundamentals and advanced applications of Repository pattern. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Repository pattern to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Hilt dependency injection",
                    "description": "Learn the fundamentals and advanced applications of Hilt dependency injection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hilt dependency injection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Clean architecture",
                    "description": "Learn the fundamentals and advanced applications of Clean architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Clean architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Practical Repository pattern",
                    "description": "Learn the fundamentals and advanced applications of Practical Repository pattern. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Repository pattern to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Composable functions",
                    "description": "Learn the fundamentals and advanced applications of Composable functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Composable functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "State in Compose",
                    "description": "Learn the fundamentals and advanced applications of State in Compose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on State in Compose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Layouts and modifiers",
                    "description": "Learn the fundamentals and advanced applications of Layouts and modifiers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Layouts and modifiers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Navigation Compose",
                    "description": "Learn the fundamentals and advanced applications of Navigation Compose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Navigation Compose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Theming",
                    "description": "Learn the fundamentals and advanced applications of Theming. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Theming to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Practical Layouts and modifiers",
                    "description": "Learn the fundamentals and advanced applications of Practical Layouts and modifiers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Layouts and modifiers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Activity and Fragment",
                    "description": "Learn the fundamentals and advanced applications of Activity and Fragment. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Activity and Fragment to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Intents",
                    "description": "Learn the fundamentals and advanced applications of Intents. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Intents to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Permissions",
                    "description": "Learn the fundamentals and advanced applications of Permissions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Permissions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "RecyclerView",
                    "description": "Learn the fundamentals and advanced applications of RecyclerView. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RecyclerView to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "ViewBinding",
                    "description": "Learn the fundamentals and advanced applications of ViewBinding. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ViewBinding to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Project: RecyclerView",
                    "description": "Learn the fundamentals and advanced applications of Project: RecyclerView. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: RecyclerView to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Kotlin syntax",
                    "description": "Learn the fundamentals and advanced applications of Kotlin syntax. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Kotlin syntax to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Null safety",
                    "description": "Learn the fundamentals and advanced applications of Null safety. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Null safety to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Data classes",
                    "description": "Learn the fundamentals and advanced applications of Data classes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Data classes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Extension functions",
                    "description": "Learn the fundamentals and advanced applications of Extension functions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Extension functions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Coroutines basics",
                    "description": "Learn the fundamentals and advanced applications of Coroutines basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Coroutines basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Deep Dive: Kotlin syntax",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Kotlin syntax. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Kotlin syntax to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Signing APK",
                    "description": "Learn the fundamentals and advanced applications of Signing APK. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Signing APK to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Play Store listing",
                    "description": "Learn the fundamentals and advanced applications of Play Store listing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Play Store listing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "In-app purchases",
                    "description": "Learn the fundamentals and advanced applications of In-app purchases. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on In-app purchases to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "App bundle optimization",
                    "description": "Learn the fundamentals and advanced applications of App bundle optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on App bundle optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Crash reporting",
                    "description": "Learn the fundamentals and advanced applications of Crash reporting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Crash reporting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Deep Dive: App bundle optimization",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: App bundle optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: App bundle optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Practical Crash reporting",
                    "description": "Learn the fundamentals and advanced applications of Practical Crash reporting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Crash reporting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "docker-kubernetes": {
        id: "docker-kubernetes",
        title: "Docker and Kubernetes",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "8 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "⛓️",
        color: "from-orange-500 to-red-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Docker","Problem Solving","Architecture"],
        careerOutcomes: ["Docker and Kubernetes"],
        chapters: [
            {
                id: "ch1-docker-kubernetes",
                title: "Production K8s",
                description: "Master the concepts of Production K8s",
                estimatedHours: 16,
                topics: [
                    { id: "topic_631", title: "Monitoring with Prometheus", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_632", title: "Logging with ELK", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_633", title: "CI/CD with ArgoCD", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_634", title: "Multi cluster management", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_635", title: "Cost optimization", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_636", title: "Deep Dive: CI/CD with ArgoCD", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ }
                ]
            },
            {
                id: "ch2-docker-kubernetes",
                title: "Kubernetes Advanced",
                description: "Master the concepts of Kubernetes Advanced",
                estimatedHours: 15,
                topics: [
                    { id: "topic_637", title: "Helm charts", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_638", title: "Horizontal pod autoscaling", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_639", title: "StatefulSets", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_640", title: "Persistent volumes", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_641", title: "RBAC", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_642", title: "Interview Qs: Persistent volumes", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ }
                ]
            },
            {
                id: "ch3-docker-kubernetes",
                title: "Kubernetes Basics",
                description: "Master the concepts of Kubernetes Basics",
                estimatedHours: 14,
                topics: [
                    { id: "topic_643", title: "K8s architecture", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_644", title: "Pods and deployments", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_645", title: "Services and ingress", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_646", title: "ConfigMaps and secrets", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_647", title: "Namespaces", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_648", title: "Deep Dive: ConfigMaps and secrets", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ }
                ]
            },
            {
                id: "ch4-docker-kubernetes",
                title: "Docker Advanced",
                description: "Master the concepts of Docker Advanced",
                estimatedHours: 13,
                topics: [
                    { id: "topic_649", title: "Multi-stage builds", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_650", title: "Docker Compose", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_651", title: "Networking", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_652", title: "Volumes and persistence", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_653", title: "Docker security", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_654", title: "Deep Dive: Docker security", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ }
                ]
            },
            {
                id: "ch5-docker-kubernetes",
                title: "Docker Fundamentals",
                description: "Master the concepts of Docker Fundamentals",
                estimatedHours: 16,
                topics: [
                    { id: "topic_655", title: "Containers vs VMs", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_656", title: "Docker installation", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_657", title: "Images and containers", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_658", title: "Dockerfile writing", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_659", title: "Docker Hub", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ },
                    { id: "topic_660", title: "Practical Dockerfile writing", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo" /* TechWorld with Nana */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Monitoring with Prometheus",
                    "description": "Learn the fundamentals and advanced applications of Monitoring with Prometheus. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Monitoring with Prometheus to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Logging with ELK",
                    "description": "Learn the fundamentals and advanced applications of Logging with ELK. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Logging with ELK to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "CI/CD with ArgoCD",
                    "description": "Learn the fundamentals and advanced applications of CI/CD with ArgoCD. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CI/CD with ArgoCD to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Multi cluster management",
                    "description": "Learn the fundamentals and advanced applications of Multi cluster management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Multi cluster management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Cost optimization",
                    "description": "Learn the fundamentals and advanced applications of Cost optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cost optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: CI/CD with ArgoCD",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: CI/CD with ArgoCD. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: CI/CD with ArgoCD to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Helm charts",
                    "description": "Learn the fundamentals and advanced applications of Helm charts. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Helm charts to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Horizontal pod autoscaling",
                    "description": "Learn the fundamentals and advanced applications of Horizontal pod autoscaling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Horizontal pod autoscaling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "StatefulSets",
                    "description": "Learn the fundamentals and advanced applications of StatefulSets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on StatefulSets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Persistent volumes",
                    "description": "Learn the fundamentals and advanced applications of Persistent volumes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Persistent volumes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "RBAC",
                    "description": "Learn the fundamentals and advanced applications of RBAC. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RBAC to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Interview Qs: Persistent volumes",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Persistent volumes. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Persistent volumes to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "K8s architecture",
                    "description": "Learn the fundamentals and advanced applications of K8s architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on K8s architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Pods and deployments",
                    "description": "Learn the fundamentals and advanced applications of Pods and deployments. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Pods and deployments to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Services and ingress",
                    "description": "Learn the fundamentals and advanced applications of Services and ingress. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Services and ingress to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "ConfigMaps and secrets",
                    "description": "Learn the fundamentals and advanced applications of ConfigMaps and secrets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ConfigMaps and secrets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Namespaces",
                    "description": "Learn the fundamentals and advanced applications of Namespaces. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Namespaces to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Deep Dive: ConfigMaps and secrets",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: ConfigMaps and secrets. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: ConfigMaps and secrets to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Multi-stage builds",
                    "description": "Learn the fundamentals and advanced applications of Multi-stage builds. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Multi-stage builds to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Docker Compose",
                    "description": "Learn the fundamentals and advanced applications of Docker Compose. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker Compose to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Networking",
                    "description": "Learn the fundamentals and advanced applications of Networking. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Networking to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Volumes and persistence",
                    "description": "Learn the fundamentals and advanced applications of Volumes and persistence. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Volumes and persistence to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Docker security",
                    "description": "Learn the fundamentals and advanced applications of Docker security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Deep Dive: Docker security",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Docker security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Docker security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Containers vs VMs",
                    "description": "Learn the fundamentals and advanced applications of Containers vs VMs. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Containers vs VMs to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Docker installation",
                    "description": "Learn the fundamentals and advanced applications of Docker installation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker installation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Images and containers",
                    "description": "Learn the fundamentals and advanced applications of Images and containers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Images and containers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Dockerfile writing",
                    "description": "Learn the fundamentals and advanced applications of Dockerfile writing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Dockerfile writing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Docker Hub",
                    "description": "Learn the fundamentals and advanced applications of Docker Hub. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Docker Hub to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Practical Dockerfile writing",
                    "description": "Learn the fundamentals and advanced applications of Practical Dockerfile writing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Dockerfile writing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "devops-aws": {
        id: "devops-aws",
        title: "DevOps with AWS",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "advanced",
        difficulty: "Advanced",
        icon: "🚀",
        color: "from-indigo-400 to-purple-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["DevOps","Problem Solving","Architecture"],
        careerOutcomes: ["DevOps with AWS"],
        chapters: [
            {
                id: "ch1-devops-aws",
                title: "AWS Advanced",
                description: "Master the concepts of AWS Advanced",
                estimatedHours: 12,
                topics: [
                    { id: "topic_661", title: "Lambda and serverless", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_662", title: "ECS and EKS", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_663", title: "CloudFormation", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_664", title: "AWS CDK", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_665", title: "Cost optimization", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_666", title: "Practical Cost optimization", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_667", title: "Practical AWS CDK", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch2-devops-aws",
                title: "AWS Core",
                description: "Master the concepts of AWS Core",
                estimatedHours: 13,
                topics: [
                    { id: "topic_668", title: "IAM and security", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_669", title: "EC2 and Auto Scaling", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_670", title: "S3 and CloudFront", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_671", title: "RDS and DynamoDB", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_672", title: "VPC networking", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_673", title: "Project: S3 and CloudFront", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch3-devops-aws",
                title: "CI/CD",
                description: "Master the concepts of CI/CD",
                estimatedHours: 13,
                topics: [
                    { id: "topic_674", title: "GitHub Actions", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_675", title: "Jenkins basics", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_676", title: "Pipeline as code", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_677", title: "Automated testing in CI", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_678", title: "Deployment strategies", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_679", title: "Advanced Pipeline as code", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch4-devops-aws",
                title: "Version Control",
                description: "Master the concepts of Version Control",
                estimatedHours: 13,
                topics: [
                    { id: "topic_680", title: "Git advanced", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_681", title: "Branching strategies", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_682", title: "Git hooks", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_683", title: "Monorepo management", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_684", title: "Code review practices", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_685", title: "Interview Qs: Git hooks", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch5-devops-aws",
                title: "Linux and Shell",
                description: "Master the concepts of Linux and Shell",
                estimatedHours: 11,
                topics: [
                    { id: "topic_686", title: "Linux commands", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_687", title: "Shell scripting", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_688", title: "Cron jobs", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_689", title: "SSH and security", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_690", title: "File permissions", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_691", title: "Deep Dive: Linux commands", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch6-devops-aws",
                title: "Infrastructure as Code",
                description: "Master the concepts of Infrastructure as Code",
                estimatedHours: 13,
                topics: [
                    { id: "topic_692", title: "Terraform basics", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_693", title: "Terraform modules", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_694", title: "State management", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_695", title: "Ansible basics", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_696", title: "Configuration management", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_697", title: "Advanced State management", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_698", title: "Practical Terraform modules", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            },
            {
                id: "ch7-devops-aws",
                title: "Monitoring and Security",
                description: "Master the concepts of Monitoring and Security",
                estimatedHours: 10,
                topics: [
                    { id: "topic_699", title: "CloudWatch", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_700", title: "Grafana dashboards", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_701", title: "Incident response", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_702", title: "Security best practices", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_703", title: "Compliance", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_704", title: "Project: Security best practices", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ },
                    { id: "topic_705", title: "Advanced Incident response", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/ulprqHHWlng" /* Abhishek Veeramalla (Hindi) */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Lambda and serverless",
                    "description": "Learn the fundamentals and advanced applications of Lambda and serverless. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lambda and serverless to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "ECS and EKS",
                    "description": "Learn the fundamentals and advanced applications of ECS and EKS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ECS and EKS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "CloudFormation",
                    "description": "Learn the fundamentals and advanced applications of CloudFormation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CloudFormation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "AWS CDK",
                    "description": "Learn the fundamentals and advanced applications of AWS CDK. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on AWS CDK to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Cost optimization",
                    "description": "Learn the fundamentals and advanced applications of Cost optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cost optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Cost optimization",
                    "description": "Learn the fundamentals and advanced applications of Practical Cost optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Cost optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical AWS CDK",
                    "description": "Learn the fundamentals and advanced applications of Practical AWS CDK. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical AWS CDK to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "IAM and security",
                    "description": "Learn the fundamentals and advanced applications of IAM and security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on IAM and security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "EC2 and Auto Scaling",
                    "description": "Learn the fundamentals and advanced applications of EC2 and Auto Scaling. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on EC2 and Auto Scaling to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "S3 and CloudFront",
                    "description": "Learn the fundamentals and advanced applications of S3 and CloudFront. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on S3 and CloudFront to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "RDS and DynamoDB",
                    "description": "Learn the fundamentals and advanced applications of RDS and DynamoDB. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on RDS and DynamoDB to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "VPC networking",
                    "description": "Learn the fundamentals and advanced applications of VPC networking. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on VPC networking to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Project: S3 and CloudFront",
                    "description": "Learn the fundamentals and advanced applications of Project: S3 and CloudFront. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: S3 and CloudFront to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "GitHub Actions",
                    "description": "Learn the fundamentals and advanced applications of GitHub Actions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on GitHub Actions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Jenkins basics",
                    "description": "Learn the fundamentals and advanced applications of Jenkins basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Jenkins basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Pipeline as code",
                    "description": "Learn the fundamentals and advanced applications of Pipeline as code. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Pipeline as code to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Automated testing in CI",
                    "description": "Learn the fundamentals and advanced applications of Automated testing in CI. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Automated testing in CI to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Deployment strategies",
                    "description": "Learn the fundamentals and advanced applications of Deployment strategies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deployment strategies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Advanced Pipeline as code",
                    "description": "Learn the fundamentals and advanced applications of Advanced Pipeline as code. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Pipeline as code to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Git advanced",
                    "description": "Learn the fundamentals and advanced applications of Git advanced. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Git advanced to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Branching strategies",
                    "description": "Learn the fundamentals and advanced applications of Branching strategies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Branching strategies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Git hooks",
                    "description": "Learn the fundamentals and advanced applications of Git hooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Git hooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Monorepo management",
                    "description": "Learn the fundamentals and advanced applications of Monorepo management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Monorepo management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Code review practices",
                    "description": "Learn the fundamentals and advanced applications of Code review practices. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Code review practices to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Interview Qs: Git hooks",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Git hooks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Git hooks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Linux commands",
                    "description": "Learn the fundamentals and advanced applications of Linux commands. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Linux commands to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Shell scripting",
                    "description": "Learn the fundamentals and advanced applications of Shell scripting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Shell scripting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Cron jobs",
                    "description": "Learn the fundamentals and advanced applications of Cron jobs. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cron jobs to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "SSH and security",
                    "description": "Learn the fundamentals and advanced applications of SSH and security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on SSH and security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "File permissions",
                    "description": "Learn the fundamentals and advanced applications of File permissions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File permissions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: Linux commands",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Linux commands. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Linux commands to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Terraform basics",
                    "description": "Learn the fundamentals and advanced applications of Terraform basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Terraform basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Terraform modules",
                    "description": "Learn the fundamentals and advanced applications of Terraform modules. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Terraform modules to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "State management",
                    "description": "Learn the fundamentals and advanced applications of State management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on State management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Ansible basics",
                    "description": "Learn the fundamentals and advanced applications of Ansible basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Ansible basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Configuration management",
                    "description": "Learn the fundamentals and advanced applications of Configuration management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Configuration management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Advanced State management",
                    "description": "Learn the fundamentals and advanced applications of Advanced State management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced State management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Practical Terraform modules",
                    "description": "Learn the fundamentals and advanced applications of Practical Terraform modules. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Terraform modules to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "CloudWatch",
                    "description": "Learn the fundamentals and advanced applications of CloudWatch. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CloudWatch to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Grafana dashboards",
                    "description": "Learn the fundamentals and advanced applications of Grafana dashboards. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Grafana dashboards to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Incident response",
                    "description": "Learn the fundamentals and advanced applications of Incident response. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Incident response to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Security best practices",
                    "description": "Learn the fundamentals and advanced applications of Security best practices. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Security best practices to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Compliance",
                    "description": "Learn the fundamentals and advanced applications of Compliance. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Compliance to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Project: Security best practices",
                    "description": "Learn the fundamentals and advanced applications of Project: Security best practices. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Security best practices to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Advanced Incident response",
                    "description": "Learn the fundamentals and advanced applications of Advanced Incident response. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Incident response to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "cybersecurity": {
        id: "cybersecurity",
        title: "Cybersecurity Fundamentals",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "12 weeks",
        level: "intermediate",
        difficulty: "Intermediate",
        icon: "💻",
        color: "from-blue-500 to-cyan-600",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Cybersecurity","Problem Solving","Architecture"],
        careerOutcomes: ["Cybersecurity Fundamentals"],
        chapters: [
            {
                id: "ch1-cybersecurity",
                title: "Ethical Hacking",
                description: "Master the concepts of Ethical Hacking",
                estimatedHours: 11,
                topics: [
                    { id: "topic_706", title: "Penetration testing methodology", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_707", title: "Reconnaissance", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_708", title: "Exploitation basics", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_709", title: "Metasploit framework", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_710", title: "Reporting", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_711", title: "Deep Dive: Exploitation basics", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_712", title: "Practical Reporting", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch2-cybersecurity",
                title: "System Security",
                description: "Master the concepts of System Security",
                estimatedHours: 19,
                topics: [
                    { id: "topic_713", title: "Windows security", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_714", title: "Linux hardening", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_715", title: "File system permissions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_716", title: "User management", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_717", title: "Patch management", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_718", title: "Project: File system permissions", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch3-cybersecurity",
                title: "Web Security",
                description: "Master the concepts of Web Security",
                estimatedHours: 13,
                topics: [
                    { id: "topic_719", title: "OWASP Top 10", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_720", title: "SQL injection", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_721", title: "XSS and CSRF", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_722", title: "Burp Suite basics", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_723", title: "API security testing", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_724", title: "Advanced API security testing", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch4-cybersecurity",
                title: "Network Security",
                description: "Master the concepts of Network Security",
                estimatedHours: 13,
                topics: [
                    { id: "topic_725", title: "TCP/IP deep dive", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_726", title: "Wireshark analysis", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_727", title: "Firewalls and IDS", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_728", title: "VPN and proxies", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_729", title: "Network scanning with Nmap", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_730", title: "Practical VPN and proxies", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch5-cybersecurity",
                title: "Security Foundations",
                description: "Master the concepts of Security Foundations",
                estimatedHours: 19,
                topics: [
                    { id: "topic_731", title: "CIA triad", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_732", title: "Types of attacks", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_733", title: "Security mindset", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_734", title: "Linux for security", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_735", title: "Networking basics", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_736", title: "Deep Dive: CIA triad", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch6-cybersecurity",
                title: "CTF and Practice",
                description: "Master the concepts of CTF and Practice",
                estimatedHours: 17,
                topics: [
                    { id: "topic_737", title: "TryHackMe challenges", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_738", title: "HackTheBox basics", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_739", title: "CTF methodology", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_740", title: "Write-up creation", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_741", title: "Building home lab", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_742", title: "Practical TryHackMe challenges", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_743", title: "Advanced Write-up creation", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            },
            {
                id: "ch7-cybersecurity",
                title: "Career Path",
                description: "Master the concepts of Career Path",
                estimatedHours: 11,
                topics: [
                    { id: "topic_744", title: "CEH certification overview", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_745", title: "CompTIA Security plus", difficulty: "Beginner", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_746", title: "Bug bounty basics", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_747", title: "Security career roadmap", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_748", title: "Portfolio building", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_749", title: "Deep Dive: CompTIA Security plus", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ },
                    { id: "topic_750", title: "Project: CEH certification overview", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck / David Bombal */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Penetration testing methodology",
                    "description": "Learn the fundamentals and advanced applications of Penetration testing methodology. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Penetration testing methodology to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Reconnaissance",
                    "description": "Learn the fundamentals and advanced applications of Reconnaissance. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Reconnaissance to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Exploitation basics",
                    "description": "Learn the fundamentals and advanced applications of Exploitation basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Exploitation basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Metasploit framework",
                    "description": "Learn the fundamentals and advanced applications of Metasploit framework. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Metasploit framework to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Reporting",
                    "description": "Learn the fundamentals and advanced applications of Reporting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Reporting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Exploitation basics",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Exploitation basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Exploitation basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Practical Reporting",
                    "description": "Learn the fundamentals and advanced applications of Practical Reporting. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical Reporting to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Windows security",
                    "description": "Learn the fundamentals and advanced applications of Windows security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Windows security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Linux hardening",
                    "description": "Learn the fundamentals and advanced applications of Linux hardening. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Linux hardening to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "File system permissions",
                    "description": "Learn the fundamentals and advanced applications of File system permissions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on File system permissions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "User management",
                    "description": "Learn the fundamentals and advanced applications of User management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on User management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Patch management",
                    "description": "Learn the fundamentals and advanced applications of Patch management. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Patch management to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Project: File system permissions",
                    "description": "Learn the fundamentals and advanced applications of Project: File system permissions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: File system permissions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "OWASP Top 10",
                    "description": "Learn the fundamentals and advanced applications of OWASP Top 10. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OWASP Top 10 to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "SQL injection",
                    "description": "Learn the fundamentals and advanced applications of SQL injection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on SQL injection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "XSS and CSRF",
                    "description": "Learn the fundamentals and advanced applications of XSS and CSRF. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on XSS and CSRF to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Burp Suite basics",
                    "description": "Learn the fundamentals and advanced applications of Burp Suite basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Burp Suite basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "API security testing",
                    "description": "Learn the fundamentals and advanced applications of API security testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on API security testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Advanced API security testing",
                    "description": "Learn the fundamentals and advanced applications of Advanced API security testing. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced API security testing to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "TCP/IP deep dive",
                    "description": "Learn the fundamentals and advanced applications of TCP/IP deep dive. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on TCP/IP deep dive to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Wireshark analysis",
                    "description": "Learn the fundamentals and advanced applications of Wireshark analysis. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Wireshark analysis to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Firewalls and IDS",
                    "description": "Learn the fundamentals and advanced applications of Firewalls and IDS. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Firewalls and IDS to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "VPN and proxies",
                    "description": "Learn the fundamentals and advanced applications of VPN and proxies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on VPN and proxies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Network scanning with Nmap",
                    "description": "Learn the fundamentals and advanced applications of Network scanning with Nmap. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Network scanning with Nmap to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Practical VPN and proxies",
                    "description": "Learn the fundamentals and advanced applications of Practical VPN and proxies. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical VPN and proxies to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "CIA triad",
                    "description": "Learn the fundamentals and advanced applications of CIA triad. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CIA triad to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Types of attacks",
                    "description": "Learn the fundamentals and advanced applications of Types of attacks. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Types of attacks to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Security mindset",
                    "description": "Learn the fundamentals and advanced applications of Security mindset. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Security mindset to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Linux for security",
                    "description": "Learn the fundamentals and advanced applications of Linux for security. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Linux for security to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Networking basics",
                    "description": "Learn the fundamentals and advanced applications of Networking basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Networking basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: CIA triad",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: CIA triad. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: CIA triad to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "TryHackMe challenges",
                    "description": "Learn the fundamentals and advanced applications of TryHackMe challenges. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on TryHackMe challenges to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "HackTheBox basics",
                    "description": "Learn the fundamentals and advanced applications of HackTheBox basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on HackTheBox basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "CTF methodology",
                    "description": "Learn the fundamentals and advanced applications of CTF methodology. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CTF methodology to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Write-up creation",
                    "description": "Learn the fundamentals and advanced applications of Write-up creation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Write-up creation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Building home lab",
                    "description": "Learn the fundamentals and advanced applications of Building home lab. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Building home lab to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Practical TryHackMe challenges",
                    "description": "Learn the fundamentals and advanced applications of Practical TryHackMe challenges. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Practical TryHackMe challenges to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Advanced Write-up creation",
                    "description": "Learn the fundamentals and advanced applications of Advanced Write-up creation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Write-up creation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "CEH certification overview",
                    "description": "Learn the fundamentals and advanced applications of CEH certification overview. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CEH certification overview to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "CompTIA Security plus",
                    "description": "Learn the fundamentals and advanced applications of CompTIA Security plus. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on CompTIA Security plus to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Bug bounty basics",
                    "description": "Learn the fundamentals and advanced applications of Bug bounty basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bug bounty basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Security career roadmap",
                    "description": "Learn the fundamentals and advanced applications of Security career roadmap. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Security career roadmap to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Portfolio building",
                    "description": "Learn the fundamentals and advanced applications of Portfolio building. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Portfolio building to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Deep Dive: CompTIA Security plus",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: CompTIA Security plus. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: CompTIA Security plus to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Project: CEH certification overview",
                    "description": "Learn the fundamentals and advanced applications of Project: CEH certification overview. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: CEH certification overview to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
    "blockchain": {
        id: "blockchain",
        title: "Blockchain Development",
        description: "Comprehensive professional training course covering industry-standard tools and practices.",
        duration: "14 weeks",
        level: "advanced",
        difficulty: "Advanced",
        icon: "⚛️",
        color: "from-yellow-400 to-orange-500",
        outcome: "Job-ready portfolio and interview preparedness",
        skills: ["Blockchain","Problem Solving","Architecture"],
        careerOutcomes: ["Blockchain Development"],
        chapters: [
            {
                id: "ch1-blockchain",
                title: "Advanced Blockchain",
                description: "Master the concepts of Advanced Blockchain",
                estimatedHours: 10,
                topics: [
                    { id: "topic_751", title: "Layer 2 solutions", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_752", title: "Cross chain bridges", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_753", title: "The Graph protocol", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_754", title: "IPFS and decentralized storage", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_755", title: "DAO development", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_756", title: "Advanced DAO development", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_757", title: "Deep Dive: Layer 2 solutions", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch2-blockchain",
                title: "Web3 Frontend",
                description: "Master the concepts of Web3 Frontend",
                estimatedHours: 11,
                topics: [
                    { id: "topic_758", title: "Ethers.js and Web3.js", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_759", title: "Wagmi and RainbowKit", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_760", title: "Wallet connection", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_761", title: "Reading contract data", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_762", title: "Writing transactions", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_763", title: "Advanced Wallet connection", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch3-blockchain",
                title: "DeFi Development",
                description: "Master the concepts of DeFi Development",
                estimatedHours: 17,
                topics: [
                    { id: "topic_764", title: "ERC20 tokens", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_765", title: "ERC721 NFTs", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_766", title: "AMM and DEX basics", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_767", title: "Lending protocols", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_768", title: "Yield farming contracts", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_769", title: "Interview Qs: Lending protocols", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch4-blockchain",
                title: "Development Tools",
                description: "Master the concepts of Development Tools",
                estimatedHours: 19,
                topics: [
                    { id: "topic_770", title: "Hardhat setup", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_771", title: "Testing with Ethers.js", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_772", title: "Deployment scripts", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_773", title: "OpenZeppelin contracts", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_774", title: "Foundry basics", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_775", title: "Project: Testing with Ethers.js", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch5-blockchain",
                title: "Solidity Advanced",
                description: "Master the concepts of Solidity Advanced",
                estimatedHours: 19,
                topics: [
                    { id: "topic_776", title: "Inheritance and interfaces", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_777", title: "Libraries", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_778", title: "Design patterns", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_779", title: "Gas optimization", difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_780", title: "Security vulnerabilities", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_781", title: "Deep Dive: Security vulnerabilities", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch6-blockchain",
                title: "Solidity Basics",
                description: "Master the concepts of Solidity Basics",
                estimatedHours: 18,
                topics: [
                    { id: "topic_782", title: "Smart contract structure", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_783", title: "Data types and variables", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_784", title: "Functions and modifiers", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_785", title: "Events and errors", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_786", title: "Remix IDE", difficulty: "Intermediate", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_787", title: "Interview Qs: Smart contract structure", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch7-blockchain",
                title: "Blockchain Basics",
                description: "Master the concepts of Blockchain Basics",
                estimatedHours: 17,
                topics: [
                    { id: "topic_788", title: "How blockchain works", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_789", title: "Consensus mechanisms", difficulty: "Beginner", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_790", title: "Cryptography fundamentals", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_791", title: "Bitcoin architecture", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_792", title: "Ethereum overview", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_793", title: "Deep Dive: Ethereum overview", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            },
            {
                id: "ch8-blockchain",
                title: "Projects and Career",
                description: "Master the concepts of Projects and Career",
                estimatedHours: 14,
                topics: [
                    { id: "topic_794", title: "DeFi protocol clone", difficulty: "Intermediate", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_795", title: "NFT marketplace", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_796", title: "DAO with governance", difficulty: "Hard", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_797", title: "Audit preparation", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_798", title: "Blockchain career path", difficulty: "Hard", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_799", title: "Interview Qs: Audit preparation", difficulty: "Hard", duration: "3 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ },
                    { id: "topic_800", title: "Deep Dive: NFT marketplace", difficulty: "Beginner", duration: "2 hours", videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ" /* freeCodeCamp Solidity */ }
                ]
            }
        ],
        steps: [
          {
                    "week": 1,
                    "topic": "Layer 2 solutions",
                    "description": "Learn the fundamentals and advanced applications of Layer 2 solutions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Layer 2 solutions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "Cross chain bridges",
                    "description": "Learn the fundamentals and advanced applications of Cross chain bridges. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cross chain bridges to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 1,
                    "topic": "The Graph protocol",
                    "description": "Learn the fundamentals and advanced applications of The Graph protocol. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on The Graph protocol to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "IPFS and decentralized storage",
                    "description": "Learn the fundamentals and advanced applications of IPFS and decentralized storage. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on IPFS and decentralized storage to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "DAO development",
                    "description": "Learn the fundamentals and advanced applications of DAO development. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DAO development to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Advanced DAO development",
                    "description": "Learn the fundamentals and advanced applications of Advanced DAO development. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced DAO development to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 2,
                    "topic": "Deep Dive: Layer 2 solutions",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Layer 2 solutions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Layer 2 solutions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Ethers.js and Web3.js",
                    "description": "Learn the fundamentals and advanced applications of Ethers.js and Web3.js. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Ethers.js and Web3.js to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Wagmi and RainbowKit",
                    "description": "Learn the fundamentals and advanced applications of Wagmi and RainbowKit. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Wagmi and RainbowKit to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 3,
                    "topic": "Wallet connection",
                    "description": "Learn the fundamentals and advanced applications of Wallet connection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Wallet connection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Reading contract data",
                    "description": "Learn the fundamentals and advanced applications of Reading contract data. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Reading contract data to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Writing transactions",
                    "description": "Learn the fundamentals and advanced applications of Writing transactions. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Writing transactions to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "Advanced Wallet connection",
                    "description": "Learn the fundamentals and advanced applications of Advanced Wallet connection. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Advanced Wallet connection to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 4,
                    "topic": "ERC20 tokens",
                    "description": "Learn the fundamentals and advanced applications of ERC20 tokens. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ERC20 tokens to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "ERC721 NFTs",
                    "description": "Learn the fundamentals and advanced applications of ERC721 NFTs. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on ERC721 NFTs to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "AMM and DEX basics",
                    "description": "Learn the fundamentals and advanced applications of AMM and DEX basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on AMM and DEX basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 5,
                    "topic": "Lending protocols",
                    "description": "Learn the fundamentals and advanced applications of Lending protocols. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Lending protocols to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Yield farming contracts",
                    "description": "Learn the fundamentals and advanced applications of Yield farming contracts. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Yield farming contracts to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Interview Qs: Lending protocols",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Lending protocols. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Lending protocols to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Hardhat setup",
                    "description": "Learn the fundamentals and advanced applications of Hardhat setup. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Hardhat setup to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 6,
                    "topic": "Testing with Ethers.js",
                    "description": "Learn the fundamentals and advanced applications of Testing with Ethers.js. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Testing with Ethers.js to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Deployment scripts",
                    "description": "Learn the fundamentals and advanced applications of Deployment scripts. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deployment scripts to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "OpenZeppelin contracts",
                    "description": "Learn the fundamentals and advanced applications of OpenZeppelin contracts. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on OpenZeppelin contracts to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Foundry basics",
                    "description": "Learn the fundamentals and advanced applications of Foundry basics. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Foundry basics to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 7,
                    "topic": "Project: Testing with Ethers.js",
                    "description": "Learn the fundamentals and advanced applications of Project: Testing with Ethers.js. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Project: Testing with Ethers.js to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Inheritance and interfaces",
                    "description": "Learn the fundamentals and advanced applications of Inheritance and interfaces. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Inheritance and interfaces to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Libraries",
                    "description": "Learn the fundamentals and advanced applications of Libraries. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Libraries to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 8,
                    "topic": "Design patterns",
                    "description": "Learn the fundamentals and advanced applications of Design patterns. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Design patterns to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Gas optimization",
                    "description": "Learn the fundamentals and advanced applications of Gas optimization. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Gas optimization to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Security vulnerabilities",
                    "description": "Learn the fundamentals and advanced applications of Security vulnerabilities. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Security vulnerabilities to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Deep Dive: Security vulnerabilities",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Security vulnerabilities. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Security vulnerabilities to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 9,
                    "topic": "Smart contract structure",
                    "description": "Learn the fundamentals and advanced applications of Smart contract structure. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Smart contract structure to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Data types and variables",
                    "description": "Learn the fundamentals and advanced applications of Data types and variables. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Data types and variables to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Functions and modifiers",
                    "description": "Learn the fundamentals and advanced applications of Functions and modifiers. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Functions and modifiers to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 10,
                    "topic": "Events and errors",
                    "description": "Learn the fundamentals and advanced applications of Events and errors. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Events and errors to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Remix IDE",
                    "description": "Learn the fundamentals and advanced applications of Remix IDE. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Remix IDE to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Interview Qs: Smart contract structure",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Smart contract structure. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Smart contract structure to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "How blockchain works",
                    "description": "Learn the fundamentals and advanced applications of How blockchain works. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on How blockchain works to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 11,
                    "topic": "Consensus mechanisms",
                    "description": "Learn the fundamentals and advanced applications of Consensus mechanisms. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Consensus mechanisms to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Cryptography fundamentals",
                    "description": "Learn the fundamentals and advanced applications of Cryptography fundamentals. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Cryptography fundamentals to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Bitcoin architecture",
                    "description": "Learn the fundamentals and advanced applications of Bitcoin architecture. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Bitcoin architecture to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 12,
                    "topic": "Ethereum overview",
                    "description": "Learn the fundamentals and advanced applications of Ethereum overview. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Ethereum overview to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "Deep Dive: Ethereum overview",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: Ethereum overview. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: Ethereum overview to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "DeFi protocol clone",
                    "description": "Learn the fundamentals and advanced applications of DeFi protocol clone. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DeFi protocol clone to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "NFT marketplace",
                    "description": "Learn the fundamentals and advanced applications of NFT marketplace. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on NFT marketplace to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 13,
                    "topic": "DAO with governance",
                    "description": "Learn the fundamentals and advanced applications of DAO with governance. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on DAO with governance to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Audit preparation",
                    "description": "Learn the fundamentals and advanced applications of Audit preparation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Audit preparation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Blockchain career path",
                    "description": "Learn the fundamentals and advanced applications of Blockchain career path. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Blockchain career path to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Interview Qs: Audit preparation",
                    "description": "Learn the fundamentals and advanced applications of Interview Qs: Audit preparation. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Interview Qs: Audit preparation to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          },
          {
                    "week": 14,
                    "topic": "Deep Dive: NFT marketplace",
                    "description": "Learn the fundamentals and advanced applications of Deep Dive: NFT marketplace. Includes hands-on challenge.",
                    "practice": "Build a mini-project focusing on Deep Dive: NFT marketplace to solidify your understanding.",
                    "resources": [
                              {
                                        "name": "Official Documentation",
                                        "url": "https://developer.mozilla.org"
                              },
                              {
                                        "name": "freeCodeCamp Guide",
                                        "url": "https://www.freecodecamp.org"
                              }
                    ]
          }
]
    },
};

// ─── Hyphenated URL-slug aliases → existing roadmap keys ────────────────────
export const COURSE_SLUG_MAP: Record<string, string> = {
  'python-beginners': 'python-beginners',
  'javascript-mastery': 'javascript-mastery',
  'frontend-react': 'frontend-react',
  'frontend-vue': 'frontend-vue',
  'backend-nodejs': 'backend-nodejs',
  'backend-django': 'backend-django',
  'fullstack-mern': 'fullstack-mern',
  'dsa-interviews': 'dsa-interviews',
  'machine-learning': 'machine-learning',
  'nlp': 'nlp',
  'data-science': 'data-science',
  'flutter': 'flutter',
  'react-native': 'react-native',
  'android-kotlin': 'android-kotlin',
  'docker-kubernetes': 'docker-kubernetes',
  'devops-aws': 'devops-aws',
  'cybersecurity': 'cybersecurity',
  'blockchain': 'blockchain',

  // Legacy onboarding trackId aliases (kept for backward compat)
  'frontend_react': 'frontend-react',
  'backend_node': 'backend-nodejs',
  'fullstack_mern': 'fullstack-mern',
  'dsa_interview': 'dsa-interviews',
  'ai_nlp': 'nlp',
  'machine_learning': 'machine-learning',
  'data_science_python': 'data-science',
  'python_beginner': 'python-beginners',
  'mobile_flutter': 'flutter',
  'mobile_react_native': 'react-native',
  'mobile_android': 'android-kotlin',
  'backend_python': 'backend-django',
  'frontend_vue': 'frontend-vue',
  'devops_docker': 'docker-kubernetes',
  'devops_aws': 'devops-aws',
  'javascript_mastery': 'javascript-mastery',
  
  'mern': 'fullstack-mern',
  'frontend': 'frontend-react',
  'backend': 'backend-nodejs',
  'ai': 'nlp',
  'ai-engineering': 'nlp',
  'prompt': 'nlp',
  'cyber': 'cybersecurity',
  'cloud': 'devops-aws',
  'cloud-devops': 'devops-aws',
  'cloudsec': 'cybersecurity',
  'android': 'android-kotlin',
  'ios': 'react-native',
  'mobile-dev': 'flutter',
  'dsa': 'dsa-interviews',
  'data-science-python': 'data-science',
};

export const getRoadmapById = (id: string): Roadmap | null => {
    return ROADMAPS[id] || ROADMAPS[COURSE_SLUG_MAP[id] ?? ''] || null;
}

export const getAllRoadmaps = (): Roadmap[] => {
    return Object.values(ROADMAPS)
}
