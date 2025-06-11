// src/pages/QuizValidated.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizDisplay from "@/components/QuizDisplay";
import useItems from "@/hooks/useItems";
import { usePageTitle } from "@/components/PageTitleContext";

export default function QuizValidated() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { setPageTitle } = usePageTitle();
    // On utilise le hook personnalisé useItems pour obtenir les items
    const [items] = useItems();
    // On cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);

    useEffect(() => {
        const raw = localStorage.getItem(`quiz_validated_${id}`);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setData(parsed);
                setPageTitle(`(Quiz corrigé) ${current?.name || "Inconnu"}`);
            } catch {
                setData(null);
            }
        }
    }, [id, setPageTitle, current]);

    if (!data) return <p className="p-4">Quiz introuvable.</p>;

    return (
        <div className="p-4">
            <h1 className="md:block hidden truncate max-w-[540px] overflow-hidden whitespace-nowrap">(Quiz corrigé) {current?.name}</h1>
            <QuizDisplay
                quiz={data.questions}
                quizValidated={true}
            />
        </div>
    );
}
