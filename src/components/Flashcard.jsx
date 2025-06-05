import { Card, CardContent } from "@/components/ui/card";

export default function Flashcard({ question, answer, revealed, setRevealed }) {
    return (
        <Card
            onClick={() => setRevealed((prev) => !prev)}
            className="cursor-pointer transition hover:shadow-md"
        >
            {revealed ? (
                <CardContent className="p-8 flex flex-col items-center justify-center text-center text-slate-700 min-h-[350px]">
                    <div>
                        <span className="font-semibold text-violet-600">Réponse :</span><br />
                        <span>{answer}</span>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="bg-violet-50 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-700 min-h-[350px]">
                    <div>
                        <span className="font-semibold">Question :</span><br />
                        <span>{question}</span>
                        </div>
                </CardContent>
            )}
        </Card>
    );
}
