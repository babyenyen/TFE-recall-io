import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";
import Editor from "@/components/ui/editor";
import useItems from "@/hooks/useItems";
import Lottie from "lottie-react";
import loaderAnimation from "@/assets/animations/loader.json";
import RenameDialogTitle from "@/components/RenameDialogTitle";
import { usePageTitle } from "@/components/PageTitleContext"; // Ensure correct path

export default function FilePage() {
    const { id } = useParams();
    // on récupère les items depuis le hook useItems
    const [items, setItems] = useItems();
    // état pour gérer le chargement du quiz
    const [loadingQuiz, setLoadingQuiz] = useState(false);

    // On cherche l'item correspondant à l'ID dans la liste des items
    const current = items.find((item) => item.id === id);

    // contexte pour le titre de la page
    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        if (current) {
            setPageTitle(current.name);
        } else {
            setPageTitle("Fichier Introuvable");
        }
    }, [setPageTitle, current]); // on met à jour le titre de la page si l'item change

    if (!current) {
        return <div className="p-4">Fichier non trouvé</div>;
    }

    // Renommer un item
    const renameItem = (id, newName) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };

    return (
        <div className="p-4">
            {loadingQuiz && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Lottie animationData={loaderAnimation} loop autoplay className="w-32 h-32" />
                    <p className="text-lg font-medium text-slate-800">Préparation du quiz...</p>
                </div>
            )}

            <div className="flex flex-wrap md:justify-start justify-between items-baseline gap-2 mb-2">
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
                    className="group bg-transparent m-0 p-0 pr-2 text-slate-400 hidden md:block"
                >
                    <Star
                        size={32}
                        className={
                            current.favorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "stroke-current group-hover:text-yellow-400"
                        }
                    />
                </button>
                <h1 className="md:block hidden truncate max-w-[540px] overflow-hidden whitespace-nowrap">{current?.name || "Note"}</h1>
                <RenameDialogTitle
                    item={current}
                    onRename={renameItem}
                />
            </div>

            <Breadcrumb items={items} />

            <Editor
                setLoadingQuiz={setLoadingQuiz}
                // current.content est le contenu de l'item en cours
                content={current.content || ""}
                // onChange met à jour le contenu de l'item en cours qu'on stocke dans useItems
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
