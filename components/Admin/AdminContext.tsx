import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type SystemMessageType = 'info' | 'warning' | 'alert';

export interface SystemMessage {
    text: string;
    type: SystemMessageType;
    active: boolean;
}

export interface FeatureToggles {
    lessons: boolean;
    lessonEditor: boolean;
    piano: boolean;
    guitar: boolean;
    cifra: boolean;
    scales: boolean;
    sheetMusic: boolean;
    memoryGame: boolean;
    idGenerator: boolean;
    quiz: boolean;
    design: boolean;
    podcasts: boolean;
}

export interface Lesson {
    id: string;
    title: string;
    videoUrl: string;
    category: string;
    description: string;
}

export interface UserPermissions {
    lessons: boolean;           // Aulas (Feed)
    lessonEditor: boolean;      // Editor de Aulas
    piano: boolean;             // Piano
    guitar: boolean;            // Violão
    cifra: boolean;             // Cifras
    scales: boolean;            // Escalas
    sheetMusic: boolean;        // Partituras
    memoryGame: boolean;        // Jogo da Memória
    quiz: boolean;              // Quiz Acordes
    idGenerator: boolean;       // Carteirinha
    design: boolean;            // Design
    podcasts: boolean;          // Podcasts
}

export interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    instrumento: 'Piano' | 'Violão' | 'Guitarra' | 'Baixo' | 'Bateria' | 'Teclado' | 'Canto';
    role: 'Admin' | 'Aluno' | 'Professor' | 'Designer';
    password: string;
    permissions: UserPermissions;
}

interface AdminContextProps {
    systemMessage: SystemMessage;
    setSystemMessage: (msg: SystemMessage) => void;
    features: FeatureToggles;
    toggleFeature: (feature: keyof FeatureToggles) => void;
    setFeaturesState: (newFeatures: FeatureToggles) => void;
    lessons: Lesson[];
    addLesson: (lesson: Omit<Lesson, 'id'>) => void;
    updateLesson: (id: string, lesson: Partial<Lesson>) => void;
    deleteLesson: (id: string) => void;
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, user: Partial<User>) => void;
    deleteUser: (id: string) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    theme: ThemeConfig;
    setTheme: (theme: ThemeConfig) => void;
    applyTheme: (theme: ThemeConfig) => void;
}

const defaultFeatures: FeatureToggles = {
    lessons: true,
    lessonEditor: false,
    piano: true,
    guitar: true,
    cifra: true,
    scales: true,
    sheetMusic: true,
    memoryGame: true,
    idGenerator: true,
    quiz: true,
    design: false,
    podcasts: false,
};

export const createDefaultPermissions = (role: 'Admin' | 'Aluno' | 'Professor' | 'Designer'): UserPermissions => {
    if (role === 'Admin') {
        return {
            lessons: true,
            lessonEditor: true,
            piano: true,
            guitar: true,
            cifra: true,
            scales: true,
            sheetMusic: true,
            memoryGame: true,
            quiz: true,
            idGenerator: true,
            design: true,
            podcasts: true,
        };
    }
    if (role === 'Professor') {
        return {
            lessons: true,
            lessonEditor: true,
            piano: true,
            guitar: true,
            cifra: true,
            scales: true,
            sheetMusic: true,
            memoryGame: true,
            quiz: true,
            idGenerator: true,
            design: false,
            podcasts: false,
        };
    }
    if (role === 'Designer') {
        return {
            lessons: false,
            lessonEditor: false,
            piano: false,
            guitar: false,
            cifra: false,
            scales: false,
            sheetMusic: false,
            memoryGame: false,
            quiz: false,
            idGenerator: true,
            design: true,
            podcasts: true,
        };
    }
    // Aluno
    return {
        lessons: true,
        lessonEditor: false,
        piano: true,
        guitar: true,
        cifra: true,
        scales: true,
        sheetMusic: true,
        memoryGame: true,
        quiz: true,
        idGenerator: true,
        design: false,
        podcasts: false,
    };
};

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [systemMessage, setSystemMessageState] = useState<SystemMessage>({ text: '', type: 'info', active: false });
    const [features, setFeatures] = useState<FeatureToggles>(defaultFeatures);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [theme, setThemeState] = useState<ThemeConfig>({
        primaryColor: '#0ea5e9',
        secondaryColor: '#8b5cf6',
        accentColor: '#f59e0b'
    });

    // Function to apply theme using CSS variables
    const applyTheme = (themeConfig: ThemeConfig) => {
        document.documentElement.style.setProperty('--color-primary', themeConfig.primaryColor);
        document.documentElement.style.setProperty('--color-secondary', themeConfig.secondaryColor);
        document.documentElement.style.setProperty('--color-accent', themeConfig.accentColor);
    };

    // Load from localStorage on mount
    useEffect(() => {
        const savedMsg = localStorage.getItem('starkids_system_message');
        const savedFeatures = localStorage.getItem('starkids_features');
        const savedLessons = localStorage.getItem('starkids_lessons');
        const savedUsers = localStorage.getItem('starkids_users');
        const savedSession = localStorage.getItem('starkids_session');
        const savedTheme = localStorage.getItem('starkids_theme');

        if (savedMsg) {
            try { setSystemMessageState(JSON.parse(savedMsg)); } catch (e) { console.error(e); }
        }
        if (savedFeatures) {
            try { setFeatures(JSON.parse(savedFeatures)); } catch (e) { console.error(e); }
        }
        if (savedLessons) {
            try { setLessons(JSON.parse(savedLessons)); } catch (e) { console.error(e); }
        } else {
            const mockLessons: Lesson[] = [{
                id: '1',
                title: 'Aula Inicial: Dó Maior',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                category: 'Piano',
                description: 'Aula introdutória sobre a escala de Dó Maior.'
            }];
            setLessons(mockLessons);
            localStorage.setItem('starkids_lessons', JSON.stringify(mockLessons));
        }
        if (savedUsers) {
            try {
                let parsedUsers: User[] = JSON.parse(savedUsers);
                const alexEmail = 'Alexandredsribeiro7@gmail.com';
                const alexIndex = parsedUsers.findIndex(u => u.email.toLowerCase() === alexEmail.toLowerCase());
                const alexUser: User = {
                    id: 'admin-alexandre',
                    name: 'Alexandre Ribeiro',
                    email: alexEmail,
                    instrumento: 'Piano',
                    role: 'Admin',
                    password: 'admin123',
                    permissions: createDefaultPermissions('Admin')
                };
                if (alexIndex >= 0) {
                    parsedUsers[alexIndex] = { ...parsedUsers[alexIndex], ...alexUser };
                } else {
                    parsedUsers = [alexUser, ...parsedUsers];
                }
                localStorage.setItem('starkids_users', JSON.stringify(parsedUsers));
                setUsers(parsedUsers);
                if (savedSession) {
                    try {
                        const sessionUser = JSON.parse(savedSession);
                        const exists = parsedUsers.find(u => u.id === sessionUser.id);
                        if (exists) setCurrentUser(sessionUser);
                        else localStorage.removeItem('starkids_session');
                    } catch (e) { console.error(e); }
                }
            } catch (e) { console.error(e); }
        } else {
            const mockUsers: User[] = [
                {
                    id: 'admin-alexandre',
                    name: 'Alexandre Ribeiro',
                    email: 'Alexandredsribeiro7@gmail.com',
                    instrumento: 'Piano',
                    role: 'Admin',
                    password: 'admin123',
                    permissions: createDefaultPermissions('Admin')
                },
                {
                    id: '1',
                    name: 'Ana Silva',
                    email: 'ana.silva@starkids.com',
                    instrumento: 'Piano',
                    role: 'Admin',
                    password: 'admin123',
                    permissions: createDefaultPermissions('Admin')
                },
                {
                    id: '2',
                    name: 'João Santos',
                    email: 'joao.santos@starkids.com',
                    instrumento: 'Violão',
                    role: 'Aluno',
                    password: 'joao123',
                    permissions: createDefaultPermissions('Aluno')
                },
                {
                    id: '3',
                    name: 'Maria Oliveira',
                    email: 'maria.oliveira@starkids.com',
                    instrumento: 'Piano',
                    role: 'Aluno',
                    password: 'maria123',
                    permissions: createDefaultPermissions('Aluno')
                }
            ];
            setUsers(mockUsers);
            localStorage.setItem('starkids_users', JSON.stringify(mockUsers));
        }

        // Load and apply saved theme
        if (savedTheme) {
            try {
                const parsedTheme = JSON.parse(savedTheme);
                setThemeState(parsedTheme);
                applyTheme(parsedTheme);
            } catch (e) {
                console.error(e);
            }
        } else {
            // Apply default theme
            applyTheme(theme);
        }
    }, []);

    const setSystemMessage = (msg: SystemMessage) => {
        setSystemMessageState(msg);
        localStorage.setItem('starkids_system_message', JSON.stringify(msg));
    };

    const toggleFeature = (feature: keyof FeatureToggles) => {
        setFeatures(prev => {
            const newFeatures = { ...prev, [feature]: !prev[feature] };
            localStorage.setItem('starkids_features', JSON.stringify(newFeatures));
            return newFeatures;
        });
    };

    const setFeaturesState = (newFeatures: FeatureToggles) => {
        setFeatures(newFeatures);
        localStorage.setItem('starkids_features', JSON.stringify(newFeatures));
    };

    // Lesson actions
    const addLesson = (lesson: Omit<Lesson, 'id'>) => {
        const newLesson = { ...lesson, id: Date.now().toString() };
        setLessons(prev => {
            const newLessons = [...prev, newLesson];
            localStorage.setItem('starkids_lessons', JSON.stringify(newLessons));
            return newLessons;
        });
    };
    const updateLesson = (id: string, updatedData: Partial<Lesson>) => {
        setLessons(prev => {
            const newLessons = prev.map(l => l.id === id ? { ...l, ...updatedData } : l);
            localStorage.setItem('starkids_lessons', JSON.stringify(newLessons));
            return newLessons;
        });
    };
    const deleteLesson = (id: string) => {
        setLessons(prev => {
            const newLessons = prev.filter(l => l.id !== id);
            localStorage.setItem('starkids_lessons', JSON.stringify(newLessons));
            return newLessons;
        });
    };

    // User actions
    const addUser = (user: Omit<User, 'id'>) => {
        const newUser = { ...user, id: Date.now().toString(), permissions: user.permissions || createDefaultPermissions(user.role) };
        setUsers(prev => {
            const newUsers = [...prev, newUser];
            localStorage.setItem('starkids_users', JSON.stringify(newUsers));
            return newUsers;
        });
    };
    const updateUser = (id: string, updatedData: Partial<User>) => {
        setUsers(prev => {
            const newUsers = prev.map(u => u.id === id ? { ...u, ...updatedData } : u);
            localStorage.setItem('starkids_users', JSON.stringify(newUsers));
            return newUsers;
        });
    };
    const deleteUser = (id: string) => {
        setUsers(prev => {
            const newUsers = prev.filter(u => u.id !== id);
            localStorage.setItem('starkids_users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Authentication
    const login = (email: string, password: string): boolean => {
        const saved = localStorage.getItem('starkids_users');
        if (!saved) return false;
        let list: User[] = [];
        try { list = JSON.parse(saved); } catch (e) { console.error(e); return false; }
        const user = list.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
        if (!user) return false;
        const pwd = user.password || '1234';
        if (password.trim() !== pwd) return false;
        setCurrentUser(user);
        localStorage.setItem('starkids_session', JSON.stringify(user));
        return true;
    };
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('starkids_session');
    };

    // Theme actions
    const setTheme = (newTheme: ThemeConfig) => {
        setThemeState(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('starkids_theme', JSON.stringify(newTheme));
    };

    return (
        <AdminContext.Provider value={{
            systemMessage,
            setSystemMessage,
            features,
            toggleFeature,
            setFeaturesState,
            lessons,
            addLesson,
            updateLesson,
            deleteLesson,
            users,
            addUser,
            updateUser,
            deleteUser,
            currentUser,
            setCurrentUser,
            login,
            logout,
            theme,
            setTheme,
            applyTheme
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error('useAdmin must be used within an AdminProvider');
    return context;
};
