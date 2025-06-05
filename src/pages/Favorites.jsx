import { useNavigate } from "react-router-dom";
import { Star, FolderClosed, File, Trash2, Pencil } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import useItems from "@/hooks/useItems";

export default function Favorites() {
    const [items, setItems] = useItems();
    const navigate = useNavigate();

    // Filtrer les éléments favoris qui ne sont pas supprimés
    const favorites = items.filter((item) => item.favorite && !item.deleted);

    // Fonction pour basculer l'état favori d'un élément
    const toggleFavorite = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, favorite: !item.favorite } : item
            )
        );
    };

    // Fonction pour supprimer un élément (le marquer comme supprimé)
    const deleteItem = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, deleted: true } : item
            )
        );
    };

    // Fonction pour renommer un élément
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

    return (
        <div className="p-4">
            <h1>Favoris</h1>
            {favorites.length === 0 ? (
                <p className="mt-4 text-slate-500">Aucun élément en favori.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {favorites.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => navigate(`/app/${item.type}/${item.id}`)}
                            className={item.type === "folder" ? "border  bg-violet-50 cursor-pointer hover:bg-violet-100 transition" : "cursor-pointer hover:bg-slate-50 transition"}
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
                                    className="group bg-transparent m-0text-slate-400"
                                >
                                    <Trash2 size={18} className="group-hover:text-red-500" />
                                </button>
                            </CardContent>
                            <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                                <div className="text-3xl">
                                    {item.type === "folder" ? <FolderClosed className="h-16 w-auto text-violet-700" /> : <File className="h-16 w-auto text-violet-700" />}
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
                    ))}
                </div>
            )}
        </div>
    );
}
