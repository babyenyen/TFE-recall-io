import { useState } from "react";
import {
    ArrowBigRight,
    ArrowBigLeft,
} from "lucide-react";
import Slide1 from "../assets/slide1.png";
import Slide2 from "../assets/slide2.png";
import Slide3 from "../assets/slide3.png";
import Slide4 from "../assets/slide4.png";

const slides = [
    {
        title: "Organise tes notes",
        description: "Crée des dossiers, fichiers, et gère ton contenu sans effort.",
        image: Slide1,
    },
    {
        title: "En italien, japonais ou anglais",
        description: "Écris tes notes dans n’importe quelle langue, elles seront automatiquement traduites.",
        image: Slide4,
    },
    {
        title: "Génère des flashcards",
        description: "Révise efficacement avec des cartes générées automatiquement.",
        image: Slide2,
    },
    {
        title: "Teste-toi avec des quiz",
        description: "QCM ou QRM, teste tes connaissances en temps réel.",
        image: Slide3,
    },
];

// IA-1-CODE: Correction de la fonction OnboardingCarousel par ChatGPT (OpenAI)
export default function OnboardingCarousel() {
    const [index, setIndex] = useState(0);

    const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="w-full max-w-xl mx-auto my-5 px-6 text-center bg-transparent relative">
            {/* Contenu du slide */}
            <div className="transition-all duration-300 md:min-h-[420px] flex flex-col items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-violet-700 mb-1">{slides[index].title}</h2>
                    <p className="text-slate-600 text-base">{slides[index].description}</p>
                </div>
                <img
                    src={slides[index].image}
                    alt={slides[index].title}
                    className="h-28 w-auto md:h-52 mx-auto mt-6 md:my-16"
                />
            </div>

            {/* Pagination par points */}
            <div className="flex justify-center gap-2 mt-6">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`p-0 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "bg-violet-600 w-6" : "bg-slate-300 w-2"
                            }`}
                        onClick={() => setIndex(i)}
                        aria-label={`Aller au slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Boutons de navigation */}
            <div className="md:mt-8 flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4">
                <button
                    onClick={prevSlide}
                    className="bg-transparent hover:text-violet-600 text-slate-300 transition"
                >
                    <ArrowBigLeft className="w-8 h-8"/>
                </button>
                <button
                    onClick={nextSlide}
                    className="bg-transparent hover:text-violet-600 text-slate-300 transition"
                >
                    <ArrowBigRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
