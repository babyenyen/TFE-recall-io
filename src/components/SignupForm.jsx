import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/auth";

// IA-1-CODE: Correction synthaxe par ChatGPT (OpenAI)
export default function SignupForm({ onToggle }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = register(username, email, password);
        if (result.success) {
            navigate("/app/dashboard");
        } else {
            setError(result.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md w-full space-y-4"
        >
            <h2 className="text-xl font-bold text-center">Créer un compte</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />

            <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />

            <button
                type="submit"
                className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
            >
                S’inscrire
            </button>

            <p className="text-sm text-center text-slate-500 mt-4">
                Déjà un compte ?{" "}
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-violet-600 hover:underline"
                >
                    Se connecter
                </button>
            </p>

        </form>
    );
}
