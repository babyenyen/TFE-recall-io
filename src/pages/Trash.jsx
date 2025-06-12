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
import noTrash from "../assets/noTrash.png";
import { restoreItemSmart } from "@/utils/items";

// Fonction récursive pour compter les enfants supprimés d’un dossier
function countDeletedChildrenRecursively(id, items) {
    let folderCount = 0;
    let fileCount = 0;

    function recurse(currentId) {
        const children = items.filter(
            (i) => i.parentId === currentId && i.deleted
        );
        for (const child of children) {
            if (child.type === "folder") {
                folderCount++;
                recurse(child.id);
            } else if (child.type === "file") {
                fileCount++;
            }
        }
    }

    recurse(id);
    return { folderCount, fileCount };
}

export default function Trash() {
    const [items, setItems] = useItems();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const navigate = useNavigate();
    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        setPageTitle("Corbeille");
    }, [setPageTitle]);

    useEffect(() => {
        const saved = localStorage.getItem("recall-dashboard");
        if (saved) setItems(JSON.parse(saved));
    }, [setItems]);

    useEffect(() => {
        localStorage.setItem("recall-dashboard", JSON.stringify(items));
    }, [items]);

    const permanentlyDelete = (id) => {
        const filtered = items.filter((item) => item.id !== id);
        setItems(filtered);
    };

    const restoreItem = (id) => {
        setItems((prev) => restoreItemSmart(id, prev));
    };

    const trashedItems = items.filter(
        (item) =>
            item.deleted && !items.find((p) => p.id === item.parentId && p.deleted)
    );

    const getWordCountFromHTML = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || "";
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    return (
        <div className="p-4">
            <div className="flex justify-end md:justify-between items-center gap-2 md:mb-2 md:mt-0">
                <h1 className="md:block hidden">Corbeille</h1>
                {trashedItems.length > 0 && (
                    <button
                        onClick={() => {
                            setSelectedItemId(null); // => signifie suppression globale
                            setOpenDialog(true);
                        }}
                        className="absolute md:static top-4 z-30 flex items-center text-sm bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                    >
                        <BrushCleaning size={18} className="inline" />
                        <p className="ml-2 hidden md:block">Sortir les poubelles</p>
                    </button>
                )}
            </div>

            <div className="mt-6">
                <ul className="space-y-2">
                    {trashedItems.length === 0 ? (
                        <li className="border border-dotted border-violet-400 bg-slate-100 rounded-lg">
                            <div className="flex justify-between text-slate-400 pt-6">
                                <img
                                    src={noTrash}
                                    alt="Nouveau fichier"
                                    className="w-auto h-32 mx-auto"
                                />
                            </div>
                            <div className="flex items-center flex-col space-y-2 pb-5">
                                <div className="text-center text-base font-semibold text-violet-600">
                                    On a fait les poubelles
                                </div>
                                <p className="text-sm text-center font-normal">
                                    Supprimé d'ici, c'est supprimé à jamais.
                                </p>
                            </div>
                        </li>
                    ) : (
                        trashedItems.map((item) => {
                            let folderCount = 0;
                            let fileCount = 0;

                            if (item.type === "folder") {
                                const result = countDeletedChildrenRecursively(item.id, items);
                                folderCount = result.folderCount;
                                fileCount = result.fileCount;
                            }

                            return (
                                <li
                                    key={item.id}
                                    onClick={() => {
                                        if (item.type === "folder") {
                                            navigate(`/app/trash/folder/${item.id}`);
                                        } else {
                                            navigate(`/app/trash/file/${item.id}`);
                                        }
                                    }}
                                    className={`flex justify-between md:items-center cursor-pointer py-2 px-3 border border-solid rounded-md border-slate-200 bg-white hover:bg-slate-50 transition`}
                                >
                                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                        <div className="flex gap-3 items-center">
                                            <div className={`rounded-md
                                            ${item.type === "folder" ? "bg-violet-600 " : "bg-violet-100 border border-solid border-violet-200"}
                                            `}>
                                                {item.type === "folder" ? (
                                                    <FolderClosed className="h-5 w-5 m-2 text-white" />
                                                ) : (
                                                    <File className="h-5 w-5 m-2 text-violet-600" />
                                                )}
                                            </div>
                                            <div className="">
                                                <div className="font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap">{item.name}</div>
                                                {item.type === "folder" ? (
                                                    <p className="text-sm text-slate-500">
                                                        {folderCount} dossier{folderCount > 1 ? "s" : ""} –{" "}
                                                        {fileCount} note{fileCount > 1 ? "s" : ""}
                                                    </p>
                                                ):(
                                                        <p className="text-sm text-slate-500">
                                                            {getWordCountFromHTML(item.content)} mot{getWordCountFromHTML(item.content) > 1 ? "s" : ""}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 justify-between p-0 text-slate-400">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                restoreItem(item.id);
                                            }}
                                            title="Restaurer"
                                            className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-green-100 hover:bg-green-200 text-green-600 transition-all h-fit"
                                        >
                                            <Undo2 size={16} />
                                            <p className="hidden sm:block ml-1 text-xs">Restaurer</p>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedItemId(item.id);
                                                setOpenDialog(true);
                                            }}
                                            title="Supprimer définitivement"
                                            className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 transition-all h-fit"
                                        >
                                            <Trash2 size={16} />
                                            <p className="hidden sm:block ml-1 text-xs">
                                                Supprimer définitivement
                                            </p>
                                        </button>
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedItemId ? "Supprimer définitivement cet élément ?" : "Sortir les poubelles ?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedItemId
                                ? "Cette action est irréversible. L’élément sera supprimé définitivement."
                                : "Cette action est irréversible. Tous les éléments de la corbeille seront supprimés définitivement."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={() => {
                                if (selectedItemId) {
                                    permanentlyDelete(selectedItemId);
                                } else {
                                    const remaining = items.filter((item) => !item.deleted);
                                    setItems(remaining);
                                }
                                setOpenDialog(false);
                            }}
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
