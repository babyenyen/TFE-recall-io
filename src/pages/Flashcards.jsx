import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useItems from "@/hooks/useItems";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { generateFlashcardsFromGemini } from "@/api/api";
import Flashcard from "@/components/Flashcard";
import {
    Undo,
    Redo,
    Info,
    Undo2
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { chunkText } from "@/utils/textUtils";
import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import loaderAnimation from "@/assets/animations/loader.json";

export default function Flashcards() {
    // On récupère l'ID du fichier depuis les paramètres de l'URL
    const { id } = useParams();
    // On utilise le hook personnalisé useItems pour obtenir les items
    const [items] = useItems();
    const navigate = useNavigate();

    // On cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);
    // flashcards, currentIndex, revealed, loadingFlashcards
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);

    const chunkIndexRef = useRef(0); // Pour suivre l'index du chunk en cours de traitement

    // Initialisation avec le 1er chunk
    useEffect(() => {
        const fetchInitialFlashcards = async () => {
            if (!current?.content) return;

            const chunks = chunkText(current.content, 1500);
            const flashcardList = [];

            for (const chunk of chunks) {
                setLoadingFlashcards(true);
                try {
                    const generated = await generateFlashcardsFromGemini(chunk);
                    if (Array.isArray(generated) && generated.length > 0) {
                    const flashcardsWithChunk = generated.map((card) => ({ ...card,
                    sourceChunk: chunk,
                    }));
                        flashcardList.push(...flashcardsWithChunk);
                    }
                } catch {
                    //empty pour pas laisser de console.error ;)
                    return [];
                } finally {
                    setLoadingFlashcards(false);
                }
            }

            const shuffled = flashcardList.sort(() => Math.random() - 0.5);
            setFlashcards(shuffled);
            setCurrentIndex(0);
            setRevealed(false);
        };

        fetchInitialFlashcards();
    }, [current]);

    // IA-1-CODE: Correction et explication de la logique derrière handleNext et handlePrevious par ChatGPT (OpenAI)
    // handleNext pour passer au suivant ou charger un nouveau depuis chunk
    const handleNext = async () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < flashcards.length) {
            setCurrentIndex(nextIndex);
            setRevealed(false);
        } else {
            const chunks = chunkText(current.content, 1500);

            // Si on atteint la fin, on revient au début (index cyclique)
            if (chunkIndexRef.current >= chunks.length) {
                chunkIndexRef.current = 0;
            }

            const chunkToUse = chunks[chunkIndexRef.current];
            chunkIndexRef.current += 1;

            setLoadingFlashcards(true);
            try {
                const generated = await generateFlashcardsFromGemini(chunkToUse);
                if (generated?.length > 0) {
                    const newFlashcard = { ...generated[0], sourceChunk: chunkToUse };
                    const updatedFlashcards = [...flashcards, newFlashcard];
                    setFlashcards(updatedFlashcards);
                    setCurrentIndex(updatedFlashcards.length - 1);
                    setRevealed(false);
                }
            } catch {
                //empty pour pas laisser de console.error ;)
                return [];
            } finally {
                setLoadingFlashcards(false);
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setRevealed(false);
        }
    };

    if (!current) {
        return <div className="p-4">Fichier introuvable</div>;
    }

    return (
        <div className="p-4">
            <h1>Flashcards pour : {current.name}</h1>
            <Breadcrumb items={items} />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between item-center gap-2 border rounded-lg border-slate-300 bg-slate-50 p-1 mb-2 text-sm text-slate-500">
                    <div className="flex item-center gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`border-solid border border-slate-300 rounded-md p-1 sm:p-2 ${currentIndex === 0
                                ? "bg-slate-100 cursor-not-allowed"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <Undo size={16} className="text-slate-500" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={flashcards.length === 0}
                            className={`border-solid border border-slate-300 rounded-md p-1 sm:p-2 ${flashcards.length === 0
                                ? "bg-slate-100 cursor-not-allowed"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <Redo size={16} className="text-slate-500" />
                        </button>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="flex items-center gap-2 border-solid border border-slate-300 bg-white p-1 sm:p-2 rounded-md text-sm text-slate-600 hover:bg-slate-50"
                                title="Aide"
                            >
                                <Info size={16} />
                            </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Comment utiliser les flashcards ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Voici quelques conseils :
                                    <br />• Clique sur la carte pour révéler/masquer la réponse.
                                    <br />• Utilise les flèches pour naviguer entre les cartes.
                                    <br />• Chaque carte est générée à partir du contenu de tes notes.
                                    <br />• Tu peux générer autant de carte que tu le souhaites.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>J'ai compris</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
                {loadingFlashcards ? (
                    <Card className="transition">
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center text-violet-600 min-h-[350px]">
                            <Lottie animationData={loaderAnimation} loop autoplay className="w-24 h-24" />
                            <p>Chargement...</p>
                        </CardContent>
                    </Card>
                ) : flashcards.length > 0 ? (
                    <Flashcard
                        question={flashcards[currentIndex].question}
                        answer={flashcards[currentIndex].answer}
                        revealed={revealed}
                        setRevealed={setRevealed}
                    />
                ) : (
                    <p>Aucune flashcard disponible. Cliquez sur "Suivante" pour commencer.</p>
                )}
                <div className="flex gap-4 mt-4">
                    <Button
                        onClick={() => navigate(`/app/file/${id}`)}
                        className="flex items-center bg-transparent hover:bg-transparent text-slate-400 hover:text-violet-600"
                    >
                        <Undo2 size={16} className="mr-2" /> Revenir aux notes
                    </Button>
                </div>
            </div>
        </div>
    );
}
