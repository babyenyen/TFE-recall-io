import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

//IA-1-CODE: Explication de la logique pour passer d'un "pompt" au "AlertDialog" de shadcn-ui par ChatGPT (OpenAI)
export default function RenameDialogCard({ item, onRename, onCancel , forceOpen = false }) {
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState(item.name);

    useEffect(() => {
        if (forceOpen) setOpen(true);
    }, [forceOpen]);

    const handleClose = () => {
        if (forceOpen && onCancel) {
            onCancel(item.id);
        }
        setOpen(false);
    };

    const handleConfirm = () => {
        if (newName.trim()) {
            onRename(item.id, newName.trim());
            setOpen(false);
        }
    };
    // IA-1-CODE: onKeyDown suggéré par ChatGPT (OpenAI)
    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger asChild>
                <button
                    title="Renommer"
                    className="group absolute -right-7 bottom-1 bg-transparent m-0 p-0 px-2 text-slate-400"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.stopPropagation();
                        }
                    }}
                >
                    <Pencil size={14} className="group-hover:text-violet-600" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Renommer</AlertDialogTitle>
                    <AlertDialogDescription>Entre le nouveau nom :</AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.stopPropagation();
                            handleConfirm();
                        }
                    }}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel variant="ghost" onClick={handleClose}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
