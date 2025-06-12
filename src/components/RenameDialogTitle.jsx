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
import { useState } from "react";
import { Pencil } from "lucide-react";

//IA-1-CODE: Explication de la logique pour passer d'un "pompt" au "AlertDialog" de shadcn-ui par ChatGPT (OpenAI)
export default function RenameDialogTitle({ item, onRename }) {
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState(item.name);

    const handleConfirm = () => {
        if (newName.trim()) {
            onRename(item.id, newName.trim());
            setOpen(false);
        }
    };
    // IA-1-CODE: onKeyDown suggéré par ChatGPT (OpenAI)
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    title="Renommer"
                    className="group bg-transparent m-0 p-0 pl-2 text-slate-400 hidden md:block"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil size={25} className="group-hover:text-violet-600" />
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
                            handleConfirm();
                        }
                    }}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
