import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";
import Editor from "@/components/ui/editor";
import useItems from "@/hooks/useItems";
import Lottie from "lottie-react";
import loaderAnimation from "@/assets/animations/loader.json";
import RenameDialogTitle from "@/components/RenameDialogTitle";

export default function FilePage() {
    // On récupère l'ID du fichier depuis les paramètres de l'URL
    const { id } = useParams();
    // On utilise le hook personnalisé useItems pour obtenir les items et la fonction de mise à jour
    const [items, setItems] = useItems();
    // État pour gérer le chargement du quiz
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    // On cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);
    // Si l'item n'existe pas, on affiche un message d'erreur
    if (!current) {
        return <div className="p-4">Fichier non trouvé</div>;
    }

    // renommer un item
    const renameItem = (id, newName) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };
    // IA-1-CODE: Correction de syntaxe et explication de la logique par ChatGPT (OpenAI)
    return (
        <div className="p-4">
            {loadingQuiz && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Lottie animationData={loaderAnimation} loop autoplay className="w-32 h-32" />
                    <p className="text-lg font-medium text-slate-800">Préparation du quiz...</p>
                </div>
            )}

            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <button
                    onClick={() => {
                        setItems((prev) =>
                            prev.map((item) =>
                                item.id === current.id
                                    ? { ...item, favorite: !item.favorite }
                                    : item
                            )
                        );
                    }}
                    title="Favori"
                    className="group bg-transparent m-0 p-0 pr-2 text-slate-400"
                >
                    <Star
                        size={38}
                        className={
                            current.favorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "stroke-current group-hover:text-yellow-400"
                        }
                    />
                </button>
                <h1>{current?.name || "Dossier"}</h1>
                <RenameDialogTitle
                    item={current}
                    onRename={renameItem}
                />
            </div>

            <Breadcrumb items={items} />

            {/* <h2 className="font-semibold mt-6 mb-2">Contenu du fichier</h2> */}
            <Editor
                setLoadingQuiz={setLoadingQuiz}
                content={current.content || ""}
                onChange={(value) => {
                    setItems((prev) =>
                        prev.map((item) =>
                            item.id === current.id ? { ...item, content: value } : item
                        )
                    );
                }}
            />

        </div>
    );
}
