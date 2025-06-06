// IA-1-CODE: Explication de ce js par ChatGPT (OpenAI)
const users = [
    {
        id: 1,
        username: "claire",
        email: "",
        password: "claire",
    },
    {
        id: 2,
        username: "prof",
        email: "",
        password: "prof",
    }
];

export const register = (username, email, password) => {
    const exists = users.find(
        (u) => u.email === email || u.username === username
    );
    if (exists) return { success: false, message: "Email ou pseudo déjà utilisé." };

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
    };

    // IA-1-CODE: Scripts de programmation : Mise en place envoyer à une base de données suggérée par ChatGPT (OpenAI)
    users.push(newUser);

    // Pour l'instant, j'utilise localStorage pour simuler une base de données
    localStorage.setItem("user", JSON.stringify(newUser));

    return { success: true };
};

export const login = (identifier, password) => {
    const found = users.find(
        (u) =>
            (u.email === identifier || u.username === identifier) &&
            u.password === password
    );

    if (!found) return { success: false, message: "Identifiants invalides." };

    localStorage.setItem("user", JSON.stringify(found));
    return { success: true };
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getUser = () => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
};

export const isLoggedIn = () => !!getUser();
