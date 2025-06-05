import Checkbox from "@/components/ui/checkbox";

// IA-1-CODE: Explication de la logique de la fonction QuizTypeSelector par ChatGPT (OpenAI)
export default function QuizTypeSelector({ quizType, setQuizType }) {
    const toggleType = (type) => {
        setQuizType((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    return (
        <div className="flex gap-4 items-center mt-1">
            <label>Type de quiz :</label>
            <label className="flex items-center gap-2">
                <Checkbox
                    checked={quizType.qcm}
                    onCheckedChange={() => toggleType("qcm")}
                />{" "}
                <span className="text-sm text-slate-700">QCM</span>
            </label>
            <label className="flex items-center gap-2">
                <Checkbox
                    checked={quizType.qrm}
                    onCheckedChange={() => toggleType("qrm")}
                />{" "}
                <span className="text-sm text-slate-700">QRM</span>
            </label>
        </div>
    );
}
