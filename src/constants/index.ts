export const DEPARTMENTS =
    ['CS',
        'Math',
        'English'
    ];


export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const MOCK_SUBJECTS = [
    {
        id: 1,
        code: "CS101",
        name: "Intro to Computer Science",
        department: "CS",
        description: "A foundational course in computer science concepts and programming.",
        createdAt: "2024-03-01T10:00:00Z"
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Math",
        description: "Further exploration of integral calculus and its applications.",
        createdAt: "2024-03-02T10:00:00Z"
    },
    {
        id: 3,
        code: "ENG301",
        name: "Academic Writing",
        department: "English",
        description: "Developing advanced writing skills for academic research and professional communication.",
        createdAt: "2024-03-03T10:00:00Z"
    }
];