import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
    Undo2,
    Check,
    X
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// IA-1-CODE: Explication et correction de la logique par ChatGPT (OpenAI)
export default function QuizDisplay({ quiz, quizValidated, setQuizValidated, score: initialScore, initialSelectedAnswers }) {
    const [selectedAnswers, setSelectedAnswers] = useState(initialSelectedAnswers ?? {});
    const navigate = useNavigate();
    const { id } = useParams();

    const [score, setScore] = useState(initialScore ?? 0);
    const total = quiz.length;

    //espace pour gerer l'interaction (selection des réponses) et mise à jour de selectedAnswers
    const toggleSelect = (qIndex, cIndex, isMultiple) => {
        setSelectedAnswers((prev) => {
            const current = prev[qIndex] || (isMultiple ? [] : null);
            if (isMultiple) {
                return {
                    ...prev,
                    [qIndex]: current.includes(cIndex)
                        ? current.filter((i) => i !== cIndex)
                        : [...current, cIndex],
                };
            } else {
                return { ...prev, [qIndex]: cIndex };
            }
        });
    };

    //validation des reps QCM : renvoie true ou false pour affichage visuel
    const isCorrectQCM = (q, selected) => selected === q.correct;

    //validation des reps QRM : renvoie true ou false pour affichage visuel
    const isCorrectQRM = (q, selected) =>
        Array.isArray(selected) &&
        selected.length === q.correct.length && //nbre reponses selected = nbre reponses correctes
        selected.every((i) => q.correct.includes(i)); //toutes reponses selected sont correctes

    const getVisualFeedback = (qIndex, choiceIndex) => {
        const q = quiz[qIndex];
        const selected = selectedAnswers[qIndex];
        const isQRM = Array.isArray(q.correct);
        const isSelected = isQRM ? selected?.includes(choiceIndex) : selected === choiceIndex;
        const isRightAnswer = isQRM ? q.correct.includes(choiceIndex) : q.correct === choiceIndex;

        let borderColor = "border-slate-300";
        let bgColor = "";
        let icon = "";

        // IA-1-CODE: Correction de la logique de feedback visuel par ChatGPT (OpenAI) car erreur de syntaxe
        if (quizValidated) {
            if (isSelected && isRightAnswer) {
                bgColor = "bg-green-100";
                borderColor = "border-green-500";
                icon = <Check size={16} className="text-green-500" />;
            } else if (isSelected && !isRightAnswer) {
                bgColor = "bg-red-100";
                borderColor = "border-red-500";
                icon = <X size={16} className="text-red-500" />;
            } else if (!isSelected && isRightAnswer) {
                borderColor = "border-green-300";
                icon = <Check size={16} className="text-slate-300" />;
            }
        } else if (isSelected) {
            bgColor = "bg-violet-100";
            borderColor = "border-violet-400";
        }

        return { borderColor, bgColor, icon };
    };

    // IA-1-CODE: Correction des conditions pour render par ChatGPT (OpenAI)
    return (
        <div className="mt-4">
            <div className="space-y-6">
                {quiz.map((q, index) => {
                    const selected = selectedAnswers[index];
                    const isQRM = Array.isArray(q.correct);
                    const isCorrect = quizValidated
                        ? isQRM
                            ? isCorrectQRM(q, selected)
                            : isCorrectQCM(q, selected)
                        : null;
                    let correctCount = 0;
                    if (selected && Array.isArray(selected)) {
                        correctCount = selected.filter((i) => q.correct.includes(i)).length;
                    }

                    const totalCorrect = q.correct.length;

                    let colorClass = "text-slate-600";
                    if (correctCount === 0) {
                        colorClass = "text-red-600";
                    } else if (correctCount === totalCorrect) {
                        colorClass = "text-green-600";
                    }

                    return (
                        <div key={index} className="p-4 bg-white rounded shadow">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold mb-2">
                                    {index + 1}. {q.question}
                                </p>
                                {quizValidated && (
                                    <span className="text-sm font-medium">
                                        {isQRM
                                            ? <span className={`flex items-center gap-1  whitespace-nowrap ${colorClass}`}>
                                                {`${correctCount}/${totalCorrect} correctes`}
                                            </span>
                                            : isCorrect ?
                                                (
                                                    <span className="flex items-center gap-1  whitespace-nowrap text-green-600">
                                                        <Check size={16} /> Correct
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1  whitespace-nowrap text-red-600">
                                                        <X size={16} /> Incorrect
                                                    </span>
                                                )}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 mt-2">
                                {isQRM ? (
                                    q.choices.map((choice, i) => {
                                        const isSelected = selected?.includes(i);
                                        const { borderColor, bgColor, icon } = getVisualFeedback(index, i);
                                        return (
                                            <label
                                                key={i}
                                                className={`flex items-center justify-between w-full p-2 border ${borderColor} ${bgColor} rounded cursor-pointer
                                                ${quizValidated ? "pointer-events-none" : ""}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={!!isSelected} //note: force checked à être boolean
                                                        onCheckedChange={() => toggleSelect(index, i, true)}
                                                        disabled={quizValidated}
                                                    />
                                                    <span className="text-sm text-slate-700">{choice}</span>
                                                </div>
                                                {quizValidated && icon && <span className="text-xl">{icon}</span>}
                                            </label>
                                        );
                                    })
                                ) : (
                                    <RadioGroup
                                        value={selected?.toString() ?? ""}
                                        onValueChange={(val) => toggleSelect(index, parseInt(val), false)}
                                        disabled={quizValidated}
                                        className="space-y-2"
                                    >
                                        {q.choices.map((choice, i) => {
                                            const { borderColor, bgColor, icon } = getVisualFeedback(index, i);
                                            return (
                                                <label
                                                    key={i}
                                                    htmlFor={`q${index}-opt${i}`}
                                                    className={`flex items-center justify-between w-full p-2 border ${borderColor} ${bgColor} rounded cursor-pointer ${quizValidated ? "pointer-events-none" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value={i.toString()}
                                                            id={`q${index}-opt${i}`}
                                                            disabled={quizValidated}
                                                        />
                                                        <span className="text-sm text-slate-700">{choice}</span>
                                                    </div>
                                                    {quizValidated && icon && <span className="text-xl">{icon}</span>}
                                                </label>
                                            );
                                        })}
                                    </RadioGroup>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!quizValidated && (
                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        className="bg-violet-600 text-white rounded-md font-medium text-sm hover:bg-violet-500"
                        onClick={() => {
                            const validatedAt = new Date().toISOString();
                            const computed = quiz.map((q, index) => ({
                                ...q,
                                selected: selectedAnswers[index] ?? (Array.isArray(q.correct) ? [] : null),
                            }));

                            const score = computed.reduce((acc, q) => {
                                const s = q.selected;
                                if (Array.isArray(q.correct)) {
                                    const allCorrect =
                                        Array.isArray(s) &&
                                        s.length === q.correct.length &&
                                        s.every((i) => q.correct.includes(i));
                                    return acc + (allCorrect ? 1 : 0);
                                } else {
                                    return acc + (s === q.correct ? 1 : 0);
                                }
                            }, 0);

                            const enrichedPayload = {
                                id: crypto.randomUUID(),
                                questions: computed,
                                score,
                                total: computed.length,
                                validatedAt,
                            };

                            let existing;
                            try {
                                const raw = localStorage.getItem(`quiz_validated_${id}`);
                                existing = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
                            } catch {
                                existing = [];
                            }

                            localStorage.setItem(`quiz_validated_${id}`, JSON.stringify([...existing, enrichedPayload]));

                            setScore(score);
                            setQuizValidated?.(true);
                        }}
                    >
                        Valider mes réponses
                    </Button>
                </div>
            )}

            {quizValidated && (
                <div className="flex justify-between gap-4">
                    <Button
                        onClick={() => navigate(`/app/file/${id}`)}
                        className="flex items-center bg-transparent hover:bg-transparent text-slate-400 hover:text-violet-600 mt-2 px-0"
                    >
                        <Undo2 size={16} className="mr-2" /> Revenir aux notes
                    </Button>
                    <p className="text-base text-right font-semibold text-slate-600 my-4">
                        Score total : {score}/{total}
                    </p>
                </div>
            )}
        </div>
    );
}
