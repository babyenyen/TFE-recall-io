import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useItems from "@/hooks/useItems";
import { usePageTitle } from "@/components/PageTitleContext";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AllQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [items] = useItems();
    const { setPageTitle } = usePageTitle();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPackId, setSelectedPackId] = useState(null);

    useEffect(() => {
        setPageTitle("Toutes les corrections");
        const keys = Object.keys(localStorage);
        const quizKeys = keys.filter(key => key.startsWith("quiz_validated_"));

        let loaded = [];

        quizKeys.forEach(key => {
            const fileId = key.replace("quiz_validated_", "");
            const raw = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    const file = items.find(i => i.id === fileId);
                    parsed.forEach(entry => {
                        loaded.push({
                            ...entry,
                            fileId,
                            fileName: file ? file.name : "Fichier inconnu"
                        });
                    });
                }
            } catch (e) {
                console.error("Erreur de parsing", key, e);
            }
        });

        setQuizzes(loaded);

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

    const deleteQuiz = (packId) => {
        // Trouver le bon fichier dans lequel se trouve ce pack
        const matchingKey = Object.keys(localStorage).find(key => {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) && data.find(q => q.id === packId);
        });

        if (!matchingKey) return;

        const list = JSON.parse(localStorage.getItem(matchingKey));
        const updated = list.filter(q => q.id !== packId);

        if (updated.length === 0) {
            localStorage.removeItem(matchingKey);
        } else {
            localStorage.setItem(matchingKey, JSON.stringify(updated));
        }

        setQuizzes(prev => prev.filter(q => q.id !== packId));
    };

    return (
        <div className="p-4">
            <h1 className="md:block hidden">Toutes les corrections</h1>
            {quizzes.length === 0 ? (
                <p className="text-slate-500">Aucune correction de quiz. Lance un quiz depuis une de tes notes.</p>
            ) : (
                <div className="mt-6">
                    <ul className="space-y-2">
                        {quizzes.map((q) => (
                            <li
                                key={q.id + q.validatedAt}
                                onClick={() => navigate(`/app/quiz-validated/${q.fileId}?q=${q.id}`)}
                                className="flex justify-between md:items-center cursor-pointer py-2 px-3 border rounded-md bg-white hover:bg-slate-50 transition"
                            >
                                <div>
                                    <p className="font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap">{q.fileName}</p>
                                    <p className="text-sm text-slate-500">
                                        {q.score}/{q.total} correctes • corrigé le {formatDate(q.validatedAt)}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPackId(q.id);
                                            setOpenDialog(true);
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
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette correction de quiz ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La correction du quiz sera supprimée définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={() => {
                                if (selectedPackId) {
                                    deleteQuiz(selectedPackId);
                                    setSelectedPackId(null);
                                    setOpenDialog(false);
                                }
                            }}
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
