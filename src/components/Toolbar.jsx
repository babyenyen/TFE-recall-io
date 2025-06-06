import { useState } from "react";
import useItems from "@/hooks/useItems";
import {
    Bold,
    Italic,
    Underline,
    Undo,
    Redo,
    Info
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import QuizTypeSelector from "@/components/QuizTypeSelector";
import { generateQuizFromGemini } from "@/api/api";
import { chunkText } from "@/utils/textUtils";
import Slide4 from "../assets/slide4.png";

export default function Toolbar({ editor, setLoadingQuiz }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [items ] = useItems();
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizType, setQuizType] = useState({ qcm: true, qrm: false });
    const [duration, setDuration] = useState(30);

    const current = items.find((item) => item.id === id);

    const handleConfirm = async () => {
        if (!current?.content) return;

        setQuizOpen(false);

        const totalTarget = 10;
        const delay = 0;
        const allQuestions = [];
        const maxAttempts = 30;

        const typesAlternés = ["QCM", "QRM"];
        const userWantsQCM = quizType.qcm;
        const userWantsQRM = quizType.qrm;

        const chunks = chunkText(current.content, 1000);
        const chunkCount = chunks.length;

        let attempts = 0;
        let chunkIndex = 0;

        while (allQuestions.length < totalTarget && attempts < maxAttempts) {
            const limitedText = chunks[chunkIndex % chunkCount];
            chunkIndex++;

            const typeIndex = attempts % typesAlternés.length;
            const quizTypeForCall =
                userWantsQCM && userWantsQRM
                    ? {
                        qcm: typesAlternés[typeIndex] === "QCM",
                        qrm: typesAlternés[typeIndex] === "QRM",
                    }
                    : quizType;

            setLoadingQuiz(true);
            try {
                const result = await generateQuizFromGemini(limitedText, quizTypeForCall, 1);
                if (Array.isArray(result)) {
                    allQuestions.push(...result);
                }
            } catch {
                if (attempts >= maxAttempts - 1) {
                    setLoadingQuiz(false);
                    alert("Une erreur est survenue lors de la génération du quiz. Veuillez réessayer plus tard.");
                    return;
                }
            } finally {
                setLoadingQuiz(false);
            }

            attempts++;
            if (delay > 0) await new Promise((res) => setTimeout(res, delay));
        }

        // IA-1-CODE: Explication de l'usage du localStorage (avec mise en place pour migration) par ChatGPT (OpenAI)
        // Stockage en localStorage
        localStorage.setItem(`quiz-${current.id}`, JSON.stringify(allQuestions));
        localStorage.setItem(`quiz-options-${current.id}`, JSON.stringify({
            duration,
            qcm: quizType.qcm,
            qrm: quizType.qrm,
        }));

        // IA-1-CODE: Explication de la logique par ChatGPT (OpenAI)
        // Redirection avec query string
        const query = new URLSearchParams({
            duration,
            qcm: quizType.qcm,
            qrm: quizType.qrm,
        });

        navigate(`/app/quiz/${current.id}?${query.toString()}`);
    };
    // IA-1-CODE: Explication de l'initilisation de l'éditeur par Tiptap par ChatGPT (OpenAI)
    if (!editor) return null;
    const isEditorEmpty = !editor.getText().trim();

    return (
        <div className="flex justify-between items-center border rounded-lg border-slate-300 bg-slate-50 p-1 mb-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={`border-solid border rounded-md p-1 sm:p-2 border-slate-300 ${editor.can().undo()
                        ? "bg-white"
                        : "bg-slate-100 pointer-events-none"
                        }`}
                >
                    <Undo size={16} className="text-slate-500" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={`border-solid border rounded-md p-1 sm:p-2 border-slate-300 ${editor.can().redo()
                        ? "bg-white"
                        : "bg-slate-100 pointer-events-none"
                        }`}
                >
                    <Redo size={16} className="text-slate-500" />
                </button>

                <Separator orientation="vertical" className="h-8 w-[1px] bg-slate-300 mx-1" />

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`border-solid border rounded-md p-1 sm:p-2 border-slate-300 ${editor.isActive("bold") ? "bg-violet-200" : "bg-white"}`}
                >
                    <Bold size={16} className="text-slate-500" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`border-solid border rounded-md p-1 sm:p-2 border-slate-300 ${editor.isActive("italic") ? "italic bg-violet-200" : "bg-white"}`}
                >
                    <Italic size={16} className="text-slate-500" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`border-solid border rounded-md p-1 sm:p-2 border-slate-300 ${editor.isActive("underline") ? "underline bg-violet-200" : "bg-white"}`}
                >
                    <Underline size={16} className="text-slate-500" />
                </button>

                <Separator orientation="vertical" className="h-8 w-[1px] bg-slate-300 mx-1" />

                <button
                    disabled={isEditorEmpty}
                    title={isEditorEmpty ? "Ajoute du contenu pour activer les flashcards" : ""}
                    onClick={() => navigate(`/app/flashcards/${id}`)}
                    className={`flex justify-center items-center border border-solid border-slate-300 rounded-md px-2 h-7 sm:h-8
                    ${isEditorEmpty
                        ? "bg-slate-100 pointer-events-none"
                            : "bg-white text-violet-600 hover:bg-violet-100"}`}>
                    Flashcards
                </button>
                <button
                    disabled={isEditorEmpty}
                    title={isEditorEmpty ? "Ajoute du contenu pour activer le quiz" : ""}
                    onClick={() => setQuizOpen(true)}
                    className={`flex justify-center items-center border border-solid border-slate-300 rounded-md px-2 h-7 sm:h-8
                    ${isEditorEmpty
                        ? "bg-slate-100 pointer-events-none"
                            : "bg-white text-violet-600 hover:bg-violet-100"}`}>
                    Quiz
                </button>
                <AlertDialog open={quizOpen} onOpenChange={setQuizOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Configuration</AlertDialogTitle>
                            <AlertDialogDescription>Choisis les options pour ton quiz.</AlertDialogDescription>
                            <div className="text-sm text-muted-foreground">
                                <label>Durée :
                                    <input
                                        type="number"
                                        min="1"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="mt-1 w-24 rounded border ml-4 mr-2 p-1 text-sm"
                                        />
                                minutes</label>
                                <QuizTypeSelector quizType={quizType} setQuizType={setQuizType} />
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirm}
                            >
                                Confirmer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        className="flex items-center gap-2 border-solid border border-slate-300 bg-white p-1 sm:p-2 rounded-md text-slate-500 hover:bg-slate-50"
                        title="Aide"
                    >
                        <Info size={16} />
                    </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Comment utiliser recall-io ?</AlertDialogTitle>
                        <div className="flex items-center">
                            <img src={Slide4} className="w-auto h-36 mr-10 mt-5" />
                            <AlertDialogDescription>
                                Voici quelques conseils :
                                <br/>• Ecris tes notes dans l'éditeur.
                                <br />• Tes notes peuvent être dans n'importe quelle langue.
                                <br/>• recall-io les traduira automatiquement.
                                <br/>• Générer des flashcards ou un quiz en cliquant sur les boutons correspondants.
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>J'ai compris</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
