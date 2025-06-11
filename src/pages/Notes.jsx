import { useNavigate } from "react-router-dom";
import { File, Star, Pencil, Trash2 } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import useItems from "@/hooks/useItems";
import noFile from "../assets/noFile.png"
import { useEffect } from "react";
import { usePageTitle } from "@/components/PageTitleContext";

export default function Notes() {
    // Hook personnalisé pour gérer les éléments (dossiers et fichiers)
    const [items, setItems] = useItems();

    const navigate = useNavigate();

    // On filtre les éléments pour obtenir uniquement les notes (fichiers) qui ne sont pas supprimés
    const notes = items.filter((item) => item.type === "file" && !item.deleted);

    // IA-1-CODE: Explication de la logique derrière Favoris, Suppression et Renommage par ChatGPT (OpenAI)
    // Basculer l'état favori d'un élément
    const toggleFavorite = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, favorite: !item.favorite } : item
            )
        );
    };

    // Supprimer un élément (marqué comme supprimé)
    const deleteItem = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, deleted: true } : item
            )
        );
    };

    // Renommer un élément
    const renameItem = (id) => {
        const newName = prompt("Nouveau nom :");
        if (newName && newName.trim()) {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, name: newName.trim() } : item
                )
            );
        }
    };

    const { setPageTitle } = usePageTitle();
    useEffect(() => { setPageTitle('Toutes les notes'); }, [setPageTitle]);

    return (
        <div className="p-4">
            <h1 className="md:block hidden">Toutes les notes</h1>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {notes.length === 0 ? (
                    <Card className="border border-dotted border-violet-400 bg-slate-100">
                        <CardContent className="flex justify-between text-slate-400 pt-6">
                            <img src={noFile} alt="Nouveau fichier" className="w-auto h-32 mx-auto" />
                        </CardContent>
                        <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                            <CardTitle className="text-center text-base font-semibold text-violet-600">
                                Tu n'as aucune note ...
                            </CardTitle>
                            <p className="text-sm text-center font-normal">Ajoute tes notes via le tableau de bord.</p>
                        </CardHeader>
                    </Card>
                ) : (
                    notes.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => navigate(`/app/file/${item.id}`)}
                            className="cursor-pointer hover:bg-slate-50 transition "
                        >
                            <CardContent className="flex justify-between p-0 text-slate-400">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(item.id);
                                    }}
                                    title="Favori"
                                    className="group bg-transparent m-0 p-4 text-slate-400"
                                >
                                    <Star
                                        size={18}
                                        className={item.favorite ? "fill-yellow-400 text-yellow-400" : "group-hover:text-yellow-400"}
                                    />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                    title="Supprimer"
                                    className="group bg-transparent m-0 text-slate-400"
                                >
                                    <Trash2 size={18} className="group-hover:text-red-500" />
                                </button>
                            </CardContent>
                            <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                                <div className="text-3xl">
                                    <File className="h-16 w-auto text-violet-700" />
                                </div>
                                <div className="flex relative">
                                    <CardTitle className="text-center text-base font-normal">
                                        {item.name}
                                    </CardTitle>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            renameItem(item.id);
                                        }}
                                        title="Renommer"
                                        className="group absolute -right-7 bottom-1 bg-transparent m-0 p-0 px-2 text-slate-300"
                                    >
                                        <Pencil size={14} className="group-hover:text-slate-500" />
                                    </button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
