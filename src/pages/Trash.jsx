import useItems from "@/hooks/useItems";
import { useEffect } from "react";
import {
    Trash2,
    FolderClosed,
    File,
    Undo2,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import noTrash from "../assets/noTrash.png"

export default function Trash() {
    // Hook personnalisé pour gérer les éléments (dossiers et fichiers)
    const [items, setItems] = useItems();

    // IA-1-CODE: Explication et correction par ChatGPT (OpenAI)
    // Un hook comme useItems n’est pas conçu pour lancer du code dans un effet de bord -> useEffect est plus approprié.

    useEffect(() => {
        const saved = localStorage.getItem("recall-dashboard");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("recall-dashboard", JSON.stringify(items));
    }, [items]);

    const permanentlyDelete = (id) => {
        const filtered = items.filter((item) => item.id !== id);
        setItems(filtered);
    };

    const trashedItems = items.filter((item) => item.deleted);

    const navigate = useNavigate();

    const restoreItem = (id) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, deleted: false } : item
        );
        setItems(updated);
    };

    return (
        <div className="p-4">
            <h1>Corbeille</h1>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {trashedItems.length === 0 ? (
                    <Card className="border border-dotted border-violet-400 bg-slate-100">
                        <CardContent className="flex justify-between text-slate-400 pt-6">
                            <img src={noTrash} alt="Nouveau fichier" className="w-auto h-32 mx-auto" />
                        </CardContent>
                        <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                            <CardTitle className="text-center text-base font-semibold text-violet-600">
                                On a fait les poubelles
                            </CardTitle>
                            <p className="text-sm text-center font-normal">Supprimer d'ici, c'est supprimer à jamais. </p>
                        </CardHeader>
                    </Card>
                ) : (
                    trashedItems.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => navigate(`/app/${item.type}/${item.id}`)}
                            className={item.type === "folder" ? "border  bg-violet-50 transition cursor-pointer" : "transition cursor-pointer"}
                        >
                            <CardContent className="flex justify-between p-0 text-slate-400">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        restoreItem(item.id);
                                    }}
                                    title="Restaurer"
                                    className="group bg-transparent m-0 p-4 text-slate-400"
                                >
                                    <Undo2 size={18} className="group-hover:text-violet-600" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        permanentlyDelete(item.id);
                                    }}
                                    title="Supprimer définitivement"
                                    className="group bg-transparent m-0 p-4 text-slate-400"
                                >
                                    <Trash2 size={18} className="group-hover:text-red-500" />
                                </button>
                            </CardContent>
                            <CardHeader className="flex items-center flex-col space-y-2 pt-0">
                                <div className="text-3xl">
                                    {item.type === "folder" ? <FolderClosed className="h-16 w-auto text-violet-700" /> : <File className="h-16 w-auto text-violet-700" />}
                                </div>
                                <div className="flex">
                                    <CardTitle className="text-center text-base font-normal">
                                        {item.name}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
