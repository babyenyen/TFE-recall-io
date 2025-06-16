import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizDisplay from "@/components/QuizDisplay";
import useItems from "@/hooks/useItems";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/components/PageTitleContext";

export default function Quiz() {
    // On récupère l'ID du quiz depuis les paramètres de l'URL
    const { id } = useParams();
    // On utilise le hook personnalisé useItems pour obtenir les items
    const [items] = useItems();
    // On cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);
    const navigate = useNavigate();

    // On initialise les états pour le quiz
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizValidated, setQuizValidated] = useState(false);
    const [quiz, setQuiz] = useState([]);
    // Options du quiz (durée, type de questions)
    const [options, setOptions] = useState({ duration: 30, qcm: true, qrm: false });
    const [timer, setTimer] = useState(0);

    // useEffect pour charger le quiz et les options depuis le localStorage
    useEffect(() => {
        const storedQuiz = JSON.parse(localStorage.getItem(`quiz-${id}`)) || [];
        const storedOptions = JSON.parse(localStorage.getItem(`quiz-options-${id}`)) || {};

        setQuiz(storedQuiz);
        setOptions(storedOptions);
        setTimer(storedOptions.duration * 60); // en secondes
    }, [id]);

    useEffect(() => {
        if (!quizStarted || quizValidated) return;

        if (timer <= 0) {
            setQuizValidated(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [quizStarted, timer, quizValidated]);

    // IA-1-CODE: Explication de la logique du minuteur par ChatGPT (OpenAI)
    // Fonction pour formater le temps restant en minutes et secondes
    const formatTime = (s) => {
        const min = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        if (current) {
            // Si l'item existe, utilise son nom comme titre
            setPageTitle("(Quiz) " + current.name);
        } else {
            // Si l'item n'est pas trouvé, affiche un titre d'erreur ou par défaut
            setPageTitle("Fichier Introuvable");
        }
    }, [setPageTitle, current]); // Dépend de 'current' pour que le titre se mette à jour si l'item (ou son nom) change
    // -----------------------------------------------------

    if (!current) {
        return <div className="p-4">Fichier non trouvé</div>;
    }

    return (
        <div className="p-4">
            <h1 className="md:block hidden truncate max-w-[750px] overflow-hidden whitespace-nowrap">(Quiz) {current?.name}</h1>
            {/* <Breadcrumb items={items} /> */}

            {!quizStarted && (
                // Expliquer le fonctionnement du quiz
                <div className="mb-4">
                    <p className="text-lg font-medium mb-2">Instructions :</p>
                    <ul className="list-disc pl-5">
                        <li>Le quiz contient {quiz.length} questions.</li>
                        <li>Tu as {options.duration} minutes pour répondre.</li>
                        <li>
                            Les questions sont de type{" "}
                            {options.qcm && options.qrm
                                ? "QCM et QRM"
                                : options.qcm
                                    ? "QCM"
                                    : options.qrm
                                        ? "QRM"
                                        : ""}
                            .
                        </li>
                        <li>Tu peux revoir tes réponses avant de valider.</li>
                    </ul>
                    <p className="mt-4">
                        Une fois le quiz commencé, le temps défilera et tu ne pourras plus modifier tes réponses.
                    </p>
                    <div className="flex mt-4">
                        <Button onClick={() => setQuizStarted(true)}>
                            Commencer
                        </Button>
                        <Button
                            onClick={() => navigate(`/app/file/${id}`)}
                            className="flex items-center bg-transparent hover:bg-transparent text-slate-400 hover:text-violet-600"
                        >
                            <Undo2 size={16} className="m-2" /> Revenir aux notes
                        </Button>
                    </div>
                </div>
            )}

            {quizStarted && (
                <>
                    <div className="md:sticky absolute right-3 top-3 md:top-0 z-50 bg-transparent flex justify-end">
                        <p className={`flex gap-2 p-3 w-fit rounded-md md:text-lg ${timer <= 60 ? "bg-red-200" : "bg-violet-200"}`}>
                            <span className="hidden md:block">Temps restant :</span>
                            <span className={`font-semibold ${timer <= 60 ? "text-red-500" : "text-violet-500"}`}> {formatTime(timer)}</span>
                        </p>
                    </div>
                    <QuizDisplay
                        quiz={quiz}
                        quizValidated={quizValidated}
                        setQuizValidated={setQuizValidated}
                        timer={timer}
                        setTimer={setTimer}
                        setQuizStarted={setQuizStarted}
                    />
                </>
            )}
        </div>
    );
}
