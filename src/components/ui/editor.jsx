import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "../Toolbar";

export default function Editor({ content, onChange, setLoadingQuiz }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: "Écris tes note ici...",
                emptyEditorClass:
                    "before:text-slate-400 before:content-[attr(data-placeholder)] before:italic",
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "min-h-[200px] border border-slate-300 rounded-lg p-4 outline-none focus:ring-2 focus:ring-primary text-sm bg-white",
            },
        },
    });

    return (
        <div className="mb-5">
            <Toolbar setLoadingQuiz={setLoadingQuiz}  editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
