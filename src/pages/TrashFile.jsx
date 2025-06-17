import { useParams } from "react-router-dom";
import useItems from "@/hooks/useItems";
import { useEffect, useState } from "react";
import Editor from "@/components/ui/editor";
import { usePageTitle } from "@/components/PageTitleContext";

//IA-1-CODE: correction synthaxe par ChatGPT (OpenAI)
export default function TrashFile() {
    const { id } = useParams();
    const [items, setItems] = useItems();
    const [current, setCurrent] = useState(null);
    const { setPageTitle } = usePageTitle();

    useEffect(() => {
        const item = items.find((i) => i.id === id && i.deleted);
        if (item) {
            setCurrent(item);
            setPageTitle(item.name || "Fichier supprimé");
        }
    }, [id, items, setPageTitle]);

    const handleUpdateContent = (newContent) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === current.id ? { ...item, content: newContent } : item
            )
        );
    };

    if (!current) {
        return (
            <div className="p-4 text-center text-slate-400">
                Fichier introuvable ou non supprimé.
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-2">
                <h1 className="md:block hidden truncate max-w-[750px] overflow-hidden whitespace-nowrap">{current?.name || "Note"}</h1>
                <span className="text-xs text-slate-400 italic">Notes en corbeille</span>
            </div>
            <Editor
                content={current.content}
                onChange={handleUpdateContent}
                editable={false}
                showToolbar={false}
            />
        </div>
    );
}
