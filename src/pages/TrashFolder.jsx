import { useParams, useNavigate } from "react-router-dom";
import { FolderClosed, File, Trash2 } from "lucide-react";
import useItems from "@/hooks/useItems";
import { useEffect, useState } from "react";
import { usePageTitle } from "@/components/PageTitleContext";
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

//IA-1-CODE: Suggestion de la fonction de comptage des enfants supprimés par ChatGPT (OpenAI)
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

// IA-1-CODE: Correction de synthaxe par ChatGPT (OpenAI)
export default function TrashFolder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useItems();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const { setPageTitle } = usePageTitle();

    const current = items.find((item) => item.id === id);
    const children = items.filter(
        (item) => item.parentId === id && item.deleted
    );

    useEffect(() => {
        if (current) setPageTitle(current.name || "Corbeille");
    }, [current, setPageTitle]);

    const permanentlyDeleteItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const getWordCountFromHTML = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || "";
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    return (
        <div className="p-4">
            <h1 className="md:block hidden truncate max-w-[750px] overflow-hidden whitespace-nowrap">{current?.name || "Corbeille"}</h1>
            <span className="text-xs text-slate-400 italic">Dossier en corbeille</span>

            <div className="mt-2">
                <ul className="space-y-2">
                    {children.length === 0 ? (
                        <p className="text-slate-400 text-center">Ce dossier est vide.</p>
                    ) : (
                        children.map((item) => {
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
                                    className={`flex justify-between md:items-center cursor-pointer py-2 px-3 border border-solid rounded-md ${item.type === "folder"
                                        ? "border-violet-200 bg-violet-50 hover:bg-violet-100"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                        } transition`}
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
                                                ) : (
                                                    <p className="text-sm text-slate-500">
                                                        {getWordCountFromHTML(item.content)} mot{getWordCountFromHTML(item.content) > 1 ? "s" : ""}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-0 text-slate-400">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedItemId(item.id);
                                                setOpenDialog(true);
                                            }}
                                            title="Supprimer définitivement"
                                            className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 transition-all"
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
                        <AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L’élément sera supprimé définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={() => {
                                if (selectedItemId) {
                                    permanentlyDeleteItem(selectedItemId);
                                }
                                setSelectedItemId(null);
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
