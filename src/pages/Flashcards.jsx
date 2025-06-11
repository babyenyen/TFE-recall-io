import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react"; // Added useCallback
import useItems from "@/hooks/useItems";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { generateFlashcardsFromGemini } from "@/api/api";
import Flashcard from "@/components/Flashcard";
import {
    ChevronsLeft,
    ChevronsRight,
    Info,
    Undo2,
    Plus,
    ThumbsDown
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
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
import Slide2 from "../assets/slide2.png";
import { usePageTitle } from "@/components/PageTitleContext"; // Correct path as per your setup

//IA-1-CODE: Explication du code par ChatGPT (OpenAI)
export default function Flashcards() {
    const { id } = useParams();
    // on recupere l'ensemble des items
    const [items] = useItems();
    const navigate = useNavigate();
    // on cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);
    // contexte pour le titre de la page
    const { setPageTitle } = usePageTitle();

    // State pour gérer les flashcards
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    //on gère si la carte est révélée ou non (qu'on passe à Flashcard.jsx)
    const [revealed, setRevealed] = useState(false);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);


    useEffect(() => {
        if (current) {
            setPageTitle(`(Flashcards) ${current.name}`);
        } else {
            setPageTitle("Fichier Introuvable");
        }
    }, [setPageTitle, current]); // on met à jour le titre de la page si l'item change

    const generateNewBundle = async () => {
        if (!current?.content) return;

        const chunks = chunkText(current.content, 1500);

        // Vérifie s’il reste des chunks à traiter
        if (chunkIndexRef.current < chunks.length) {
            const chunkToUse = chunks[chunkIndexRef.current];
            chunkIndexRef.current += 1;

            await fetchFlashcardsFromChunk(chunkToUse, true); // append = true
        } else {
            //empty pour pas laisser de console.error ;)
            //tous les chunks ont été traités
            return [];
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem(`flashcards_${id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.cards) {
                setFlashcards(parsed.cards);
            }
        } else {
            generateNewBundle();
        }
    }, [id]);

    // on garde en mémoire l'index du prochain chunk à envoyer à api.js car le premier (chunks[0]) est d'office envoyé
    const chunkIndexRef = useRef(0);

    const fetchFlashcardsFromChunk = useCallback(async (chunk, append = true) => {
        setLoadingFlashcards(true);
        try {
            const generated = await generateFlashcardsFromGemini(chunk);
            if (Array.isArray(generated) && generated.length > 0) {
                const flashcardsWithChunk = generated.map((card) => ({
                    ...card,
                    sourceChunk: chunk,
                }));

                setFlashcards(prev => {
                    const updated = append
                        ? [...prev, ...flashcardsWithChunk]
                        : flashcardsWithChunk;

                    // on sauvegarde les flashcards dans le localStorage avec la date
                    localStorage.setItem(`flashcards_${id}`, JSON.stringify({
                        createdAt: new Date().toISOString(),
                        cards: updated
                    }));

                    if (!append) {
                        setCurrentIndex(0);
                    }

                    return updated;
                });
            } else {
                if (!append && flashcards.length === 0) {
                    setFlashcards([]);
                    localStorage.removeItem(`flashcards_${id}`);
                }
            }
        } catch {
            //empty pour pas laisser de console.error ;)
            return [];
        } finally {
            setLoadingFlashcards(false);
        }
    }, [id, flashcards.length, setCurrentIndex]);

    useEffect(() => {
        if (!current?.content) {
            setFlashcards([]); // on reset les flashcards si le contenu est vide
            return;
        }

        // on divise le contenu en chunks
        const chunks = chunkText(current.content, 1500);
        if (chunks.length > 0) {
            chunkIndexRef.current = 1; // on commence à 1 car on va déjà charger le premier chunk
        } else {
            setFlashcards([]);
        }
    }, [current, fetchFlashcardsFromChunk]); // on refait la requête si le contenu change

    // handleNext pour passer à la carte suivante
    const handleNext = () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < flashcards.length) {
            setCurrentIndex(nextIndex);
        } else {
            // si on est à la fin, on revient à la première carte
            setCurrentIndex(0);
        }

        setRevealed(false); // on cache la réponse dans tous les cas
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setRevealed(false);
        }
    };

    const handleDeleteCurrentCard = () => {
        const updated = flashcards.filter((_, index) => index !== currentIndex);
        setFlashcards(updated);
        localStorage.setItem(`flashcards_${id}`, JSON.stringify(updated));

        // si on est à la fin, on revient à l'avant-dernière carte (ou à 0 si plus rien)
        if (currentIndex >= updated.length) {
            setCurrentIndex(updated.length - 1 >= 0 ? updated.length - 1 : 0);
        }
        setRevealed(false);
    };


    if (!current) {
        return <div className="p-4">Fichier introuvable</div>;
    }

    return (
        <div className="p-4">
            <h1 className="md:block hidden truncate max-w-[540px] overflow-hidden whitespace-nowrap">Flashcards pour : {current.name}</h1>
            <Breadcrumb items={items} />
            <div className="max-w-2xl mx-auto relative">
                <div className="flex justify-between items-center gap-2 border rounded-lg border-slate-300 bg-slate-50 p-1 mb-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`border-solid border border-slate-300 rounded-md p-1 sm:p-2 ${currentIndex === 0
                                ? "bg-slate-100 pointer-events-none"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <ChevronsLeft size={16} className="text-slate-500" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={flashcards.length === 0 && !loadingFlashcards}
                            className={`border-solid border border-slate-300 rounded-md p-1 sm:p-2 ${flashcards.length === 0 && !loadingFlashcards
                                ? "bg-slate-100 pointer-events-none"
                                : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <ChevronsRight size={16} className="text-slate-500" />
                        </button>
                        <Separator orientation="vertical" className="h-6 sm:h-8 w-[1px] bg-slate-300 mx-1" />
                        <button
                            onClick={generateNewBundle}
                            className="flex justify-center items-center border border-solid border-slate-300 rounded-md p-1 sm:p-2 bg-violet-600 text-white hover:bg-violet-500 transition-all">
                            <Plus
                                size={16}
                                className="bg-transparent" />
                            <p className="hidden sm:block ml-1 text-xs">Générer un pack</p>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteCurrentCard}
                            className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                        >
                            <ThumbsDown size={16} className="text-red-600" />
                            <p className="hidden sm:block ml-1 text-xs">Supprimer</p>
                        </button>
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
                                    <div className="flex items-center md:flex-row flex-col">
                                        <img src={Slide2} className="w-auto h-36 mr-10 mt-5" />
                                        <AlertDialogDescription className="text-left mt-5 md:m-0">
                                            Voici quelques conseils :
                                            <br />• Clique sur "+" pour générer un pack de flashcards.
                                            <br />• Utilise les flèches pour naviguer entre les cartes.
                                            <br />• Chaque pack est généré à partir du contenu de tes notes.
                                            <br />• Si une carte ne te plait pas, supprime la du pack en appuyant sur le pouce vers le bas.
                                        </AlertDialogDescription>
                                    </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>J'ai compris</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="absolute top-14 [left:calc(50%-50px)]">
                    <p className="text-sm text-slate-500 mb-2 text-center w-[100px]">
                        Carte {currentIndex + 1} / {flashcards.length}
                    </p>
                </div>
                {loadingFlashcards && flashcards.length === 0 ? (
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
                    <Card className="transition">
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center text-violet-600 min-h-[350px]">
                            <Lottie animationData={loaderAnimation} loop autoplay className="w-24 h-24" />
                            <p>Il n'y a aucune cartes. Génère vite un pack.</p>
                        </CardContent>
                    </Card>
                )}
                <Button
                    onClick={() => navigate(`/app/file/${id}`)}
                    className="flex items-center bg-transparent hover:bg-transparent text-slate-400 hover:text-violet-600 px-0"
                >
                    <Undo2 size={16} className="mr-2" /> Revenir aux notes
                </Button>
            </div>
        </div>
    );
}
