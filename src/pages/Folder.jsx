import { useParams, useNavigate } from "react-router-dom";
import {
    Plus,
    FolderPlus,
    FilePlus,
    Star,
    Trash2,
    FolderClosed,
    File,
} from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";
import useItems from "@/hooks/useItems";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import RenameDialogCard from "@/components/RenameDialogCard";
import RenameDialogTitle from "@/components/RenameDialogTitle";

export default function Folder() {
    // On récupère l'ID du dossier courant depuis les paramètres de l'URL
    const { id: currentFolderId } = useParams();
    // Hook personnalisé pour gérer les éléments (dossiers et fichiers)
    const [items, setItems] = useItems();

    const navigate = useNavigate();

    // On récupère l'élément courant (dossier) en fonction de l'ID dans l'URL
    const current = items.find((item) => item.id === currentFolderId);

    // On filtre les éléments pour obtenir uniquement ceux qui sont dans le dossier courant et qui ne sont pas supprimés
    const folderItems = items.filter(
        (item) => item.parentId === currentFolderId && !item.deleted
    );

    // Ajout d'un nouvel élément (dossier ou fichier)
    const handleAdd = (type) => {
        const newItem = {
            id: crypto.randomUUID(),
            type,
            name: type === "folder" ? "Nouveau dossier" : "Nouveau fichier",
            favorite: false,
            deleted: false,
            parentId: currentFolderId, // 🔑 important
        };
        setItems((prev) => [...prev, newItem]);
    };

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
    const renameItem = (id, newName) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };

    return (
        <div className="w-full h-full p-4">
            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                {current && (
                    <>
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
                    </>
                )}
            </div>

            <Breadcrumb items={items} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Nouveau
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuItem onClick={() => handleAdd("folder")}>
                        <FolderPlus className="pr-2" /> Créer un dossier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAdd("file")}>
                        <FilePlus className="pr-2" /> Créer un fichier
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {folderItems.map((item) => (
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
                                className="group bg-transparent m-0 p-4"
                            >
                                <Star
                                    size={18}
                                    className={
                                        item.favorite
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "group-hover:text-yellow-400"
                                    }
                                />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteItem(item.id);
                                }}
                                title="Supprimer"
                                className="group bg-transparent m-0 p-4"
                            >
                                <Trash2 size={18} className="group-hover:text-red-500" />
                            </button>
                        </CardContent>
                        <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                            <div className="text-3xl">
                                {item.type === "folder" ? (
                                    <FolderClosed className="h-16 w-auto text-violet-700" />
                                ) : (
                                    <File className="h-16 w-auto text-violet-700" />
                                )}
                            </div>
                            <div className="flex relative">
                                <CardTitle className="text-center text-base font-normal">
                                    {item.name}
                                </CardTitle>
                                <RenameDialogCard item={item} onRename={renameItem} />
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
