import useItems from "@/hooks/useItems";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
    Plus,
    FolderPlus,
    FilePlus,
    FolderClosed,
    File,
    Star,
    Trash2
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { getUser } from "@/utils/auth";
import { useEffect, useState } from "react";
import newFile from "../assets/newFile.png"
import { usePageTitle } from "@/components/PageTitleContext";
import { deleteItemSmart } from "@/utils/items";

//IA-1-CODE: Explication de la logique derrière Ajout, Favoris, Suppression et Renommage par ChatGPT (OpenAI)
export default function Dashboard() {
    // Hook personnalisé pour gérer les éléments (dossiers et fichiers)
    const [items, setItems] = useItems();
    const [newItemId, setNewItemId] = useState(null);

    // Chargement initial
    useItems(() => {
        const saved = localStorage.getItem("recall-dashboard");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    // Mise à jour du localStorage
    useItems(() => {
        localStorage.setItem("recall-dashboard", JSON.stringify(items));
    }, [items]);

    // Ajout d'un nouvel élément (dossier ou fichier)
    const handleAdd = (type) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newItem = {
            id,
            type,
            name: type === "folder" ? "Nouveau dossier" : "Nouveau fichier",
            favorite: false,
            deleted: false,
            createdAt: now,
            updatedAt: now,
        };
        setItems((prev) => [...prev, newItem]);
        setNewItemId(id);
    };

    const handleCancelRename = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Navigation
    const navigate = useNavigate();

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
        setItems((prev) => deleteItemSmart(id, prev));
    };

    // Renommer un élément
    const renameItem = (id, newName) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        const current = getUser();
        setUser(current);
    }, []);

    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        // on met à jour le titre de la page dynamiquement
        const dynamicTitle = `Bienvenue ${user?.username ?? "à toi"} !`;
        setPageTitle(dynamicTitle);
    }, [setPageTitle, user]); // on ajoute 'user' comme dépendance pour mettre à jour le titre si l'utilisateur change

    const rootVisibleItems = items.filter(
        (item) => !item.deleted && !item.parentId
    );
// IA-1-CODE: correction syntaxe par ChatGPT (OpenAI)
    return (
        <div className="w-full h-full p-4">
            <h1 className="md:block hidden" >Bienvenue {user?.username ?? "à toi"} !</h1>
            <Breadcrumb items={items} />
            {/* Bouton + menu */}
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
                {rootVisibleItems.length === 0 ? (
                    <Card className="border border-dotted border-violet-400 bg-slate-100">
                        <CardContent className="flex justify-between text-slate-400 pt-6">
                            <img src={newFile} alt="Nouveau fichier" className="w-auto h-32 mx-auto" />
                        </CardContent>
                        <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                            <CardTitle className="text-center text-base font-semibold text-violet-600">
                                C'est un peu vide ici ...
                            </CardTitle>
                            <p className="text-sm text-center font-normal">Ajoute vite un élément.</p>
                        </CardHeader>
                    </Card>
                ) : (
                        rootVisibleItems.map((item) => {
                            const date = new Date(item.updatedAt || item.createdAt || Date.now());
                            const formattedDate = isNaN(date.getTime())
                                ? "—"
                                : date.toLocaleString("fr-FR", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                            return (
                                <Card
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && navigate(`/app/${item.type}/${item.id}`)}
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
                                            className="group bg-transparent m-0 text-slate-400"
                                        >
                                            <Trash2 size={18} className="group-hover:text-red-500" />
                                        </button>
                                    </CardContent>
                                    <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                                        <div className="text-3xl">
                                            {item.type === "folder" ? <FolderClosed className="h-16 w-auto text-violet-700" /> : <File className="h-16 w-auto text-violet-700" />}
                                        </div>
                                        <div className="flex relative">
                                            <CardTitle className="text-center text-base font-normal truncate max-w-[140px] overflow-hidden whitespace-nowrap">
                                                {item.name}
                                            </CardTitle>
                                            <RenameDialogCard
                                                item={item}
                                                onRename={renameItem}
                                                onCancel={handleCancelRename}
                                                forceOpen={item.id === newItemId}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">Modifié le {formattedDate}</p>
                                    </CardHeader>
                                </Card>
                            );
                        })
                    )}
            </div>
        </div>
    );
}
