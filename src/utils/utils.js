// IA-1-CODE: Code généré par ChatGPT (OpenAI)
// fusionne les classes utilitaires de Tailwind CSS et clsx
// pour gérer les classes conditionnelles et les conflits de styles
// évite les doublons et les conflits de styles
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
