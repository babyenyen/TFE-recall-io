import useItems from "@/hooks/useItems";
import { useEffect, useState } from "react";
import { usePageTitle } from "@/components/PageTitleContext";
import {
    Trash2,
    FolderClosed,
    File,
    Undo2,
    BrushCleaning,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
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

    const [openDialog, setOpenDialog] = useState(false);

    const { setPageTitle } = usePageTitle();
    useEffect(() => { setPageTitle('Corbeille'); }, [setPageTitle]);

    return (
        <div className="p-4">
            <div className="flex justify-end md:justify-between items-center gap-2 md:mb-2 md:mt-0">
                <h1 className="md:block hidden">Corbeille</h1>
                {trashedItems.length > 0 && (
                    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                        <AlertDialogTrigger asChild>
                            <button
                                className="absolute md:static top-4 z-30 flex items-center text-sm bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                            >
                                <BrushCleaning size={18} className="inline" />
                                <p className="ml-2 hidden md:block">Sortir les poubelles</p>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sortir les poubelles ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Tous les éléments de la corbeille seront supprimés définitivement.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-700"
                                    onClick={() => {
                                        const remaining = items.filter((item) => !item.deleted);
                                        setItems(remaining);
                                        setOpenDialog(false);
                                    }}
                                >
                                    Supprimer tout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
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
                            <p className="text-sm text-center font-normal">Supprimé d'ici, c'est supprimé à jamais. </p>
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
                                    <CardTitle className="text-center text-base font-normal truncate max-w-[140px] overflow-hidden whitespace-nowrap">
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
