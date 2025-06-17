import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useItems from "@/hooks/useItems";
import { usePageTitle } from "@/components/PageTitleContext";
import {
    Trash2
} from "lucide-react";
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

// IA-1-CODE : Correction et explication de la logique par ChatGPT (OpenAI)
export default function AllFlash() {
    const [packs, setPacks] = useState([]);
    const navigate = useNavigate();
    const [items] = useItems(); // pour récupérer les noms des fichiers
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPackId, setSelectedPackId] = useState(null);

    //IA-1-CODE : Explication de la logique pour retrouver l'id des fichier expliqué par ChatGPT (OpenAI)
    useEffect(() => {
        const allKeys = Object.keys(localStorage);
        const flashcardKeys = allKeys.filter(key => key.startsWith("flashcards_"));

        const foundPacks = flashcardKeys.map(key => {
            const fileId = key.replace("flashcards_", "");
            const file = items.find(item => item.id === fileId);
            const raw = localStorage.getItem(key);
            let createdAt = null;
            let count = 0;

            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    // ancien format sans date
                    count = parsed.length;
                } else if (parsed?.cards) {
                    count = parsed.cards.length;
                    createdAt = parsed.createdAt;
                }
            } catch {
                //empty pour pas laisser de console.error ;)
                return [];
            }

            return {
                id: fileId,
                name: file ? file.name : "Fichier inconnu",
                count,
                createdAt
            };
        });

        foundPacks.sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt) - new Date(a.createdAt); // décroissant
        });

        setPacks(foundPacks);
    }, [items]);

    //IA-1-CODE: Correction de la fonction de formatage de date par ChatGPT (OpenAI)
    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleDeletePack = (packId) => {
        localStorage.removeItem(`flashcards_${packId}`);
        setPacks(prev => prev.filter(pack => pack.id !== packId));
    };

    const { setPageTitle } = usePageTitle();
    useEffect(() => { setPageTitle('Toutes les flashcards'); }, [setPageTitle]);

    return (
        <div className="p-4">
            <h1 className="md:block hidden">Tous les packs de flashcards</h1>
            {packs.length === 0 ? (
                <p className="text-slate-500 pt-4">Il n’y a pas de flash ici. Tu peux en générer via ta page de notes.</p>
            ) : (
                <div className="mt-6">
                    <ul className="space-y-2">
                        {packs.map((pack) => (
                            <li
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && navigate(`/app/flashcards/${pack.id}`)}
                                key={pack.id}
                                className="flex justify-between md:items-center cursor-pointer py-2 px-3 border rounded-md bg-white hover:bg-slate-50 transition"
                                onClick={() => navigate(`/app/flashcards/${pack.id}`)}
                            >
                                <div>
                                    <p className="font-medium">
                                        {pack.name} </p>
                                    <p className="text-sm text-slate-500">{pack.count} cartes • {pack.createdAt && ` créé le ${formatDate(pack.createdAt)}`}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 md:items-center items-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // évite que le click ouvre la page
                                            setSelectedPackId(pack.id);
                                            setOpenDialog(true);
                                        }}
                                        className="flex justify-center items-center rounded-md p-1 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                                        title="Supprimer ce pack"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                        <p className="hidden sm:block ml-1 text-xs">Supprimer le pack</p>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce pack de flashcards ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le pack de flashcards sera supprimé définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={() => {
                                if (selectedPackId) {
                                    handleDeletePack(selectedPackId);
                                    setSelectedPackId(null);
                                    setOpenDialog(false);
                                }
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
