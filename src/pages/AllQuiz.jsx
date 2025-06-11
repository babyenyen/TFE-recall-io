import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useItems from "@/hooks/useItems";
import { usePageTitle } from "@/components/PageTitleContext";
import { Trash2 } from "lucide-react";

export default function AllQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [items] = useItems();
    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        setPageTitle("Tous les quiz corrigés");
        const keys = Object.keys(localStorage);
        const quizKeys = keys.filter(key => key.startsWith("quiz_validated_"));

        const loaded = quizKeys.map(key => {
            const fileId = key.replace("quiz_validated_", "");
            const raw = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(raw);
                const file = items.find(i => i.id === fileId);
                return {
                    id: fileId,
                    name: file ? file.name : "Fichier inconnu",
                    score: parsed.score,
                    total: parsed.total,
                    validatedAt: parsed.validatedAt,
                };
            } catch {
                return null;
            }
        }).filter(Boolean);

        setQuizzes(loaded);
    }, [items, setPageTitle]);

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const deleteQuiz = (id) => {
        localStorage.removeItem(`quiz_validated_${id}`);
        setQuizzes(prev => prev.filter(q => q.id !== id));
    };

    return (
        <div className="p-4">
            <h1 className="md:block hidden">Tous les quiz corrigés</h1>
            {quizzes.length === 0 ? (
                <p className="text-slate-500">Aucun quiz validé. Lance un quiz depuis une page de fichier.</p>
            ) : (
                <div className="mt-6">
                    <ul className="space-y-2">
                        {quizzes.map((q) => (
                            <li
                                key={q.id}
                                onClick={() => navigate(`/app/quiz-validated/${q.id}`)}
                                className="flex justify-between md:items-center cursor-pointer p-2 border rounded-md bg-white hover:bg-slate-50 transition"
                            >
                                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                    <p className="font-medium">{q.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {q.score}/{q.total} correctes
                                    </p>
                                </div>
                                <div className="flex flex-col-reverse md:flex-row gap-2 md:items-center items-end">
                                    <p className="text-xs text-slate-500">
                                        corrigé le {formatDate(q.validatedAt)}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteQuiz(q.id)
                                        }}
                                        className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                                        title="Supprimer cette correction"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                        <p className="hidden sm:block ml-1 text-xs">Supprimer la correction</p>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
