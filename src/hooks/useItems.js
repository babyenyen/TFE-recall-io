import { useState, useEffect } from "react";

// IA-1-CODE: Correction et explication de la fonction useItems par ChatGPT (OpenAI)
export default function useItems() {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem("recall-dashboard");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("recall-dashboard", JSON.stringify(items));
    }, [items]);

    return [items, setItems];
}
