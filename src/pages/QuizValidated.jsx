// src/pages/QuizValidated.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizDisplay from "@/components/QuizDisplay";
import { usePageTitle } from "@/components/PageTitleContext";

export default function QuizValidated() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        const raw = localStorage.getItem(`quiz_validated_${id}`);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setData(parsed);
                setPageTitle(`Quiz validé`);
            } catch {
                setData(null);
            }
        }
    }, [id, setPageTitle]);

    if (!data) return <p className="p-4">Quiz introuvable.</p>;

    return (
        <div className="p-4">
            <QuizDisplay
                quiz={data.questions}
                quizValidated={true}
            />
        </div>
    );
}
