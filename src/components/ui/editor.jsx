import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "../Toolbar";

export default function Editor({ content, onChange, setLoadingQuiz, editable = true, showToolbar = true }) {
    const editor = useEditor({
        editable,
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: "Écris tes notes ici...",
                emptyEditorClass:
                    "before:text-slate-400 before:content-[attr(data-placeholder)] before:italic",
            }),
            CharacterCount.configure(),
        ],
        content,
        onUpdate: ({ editor }) => {
            if (editable) {
                onChange?.(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm max-w-none h-[570px] md:h-[600px] overflow-auto p-4 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm",
            },
        },
    });

    return (
        <div className="flex flex-col gap-2">
            {showToolbar && <Toolbar setLoadingQuiz={setLoadingQuiz} editor={editor} />}
            <EditorContent editor={editor} className="text-[16px]"/>
            {editor && (
                <div className="text-right text-xs text-slate-400">
                    {editor.storage.characterCount.characters()} caractères | {editor.storage.characterCount.words()} mots
                </div>
            )}
        </div>
    );
}
