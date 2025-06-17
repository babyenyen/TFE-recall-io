import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { usePageTitle } from "@/components/PageTitleContext";
import welcomeCTA from "../assets/welcomeCTA.png"

export default function WelcomePage() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const current = getUser();
        setUser(current);
    }, []);

    const { setPageTitle } = usePageTitle();
    useEffect(() => {
        // on met à jour le titre de la page dynamiquement expliqué par ChatGPT (OpenAI)
        const dynamicTitle = `Bienvenue ${user?.username ?? "à toi"} !`;
        setPageTitle(dynamicTitle);
    }, [setPageTitle, user]); // on ajoute 'user' comme dépendance pour mettre à jour le titre si l'utilisateur change

    return (
        <div className="p-4">
            <h1 className="md:block hidden" >Bienvenue {user?.username ?? ""} !</h1>
            <p>
                Pour accèder à ton tableau de bord, clique sur la première icône du menu de gauche.
                <br />Tu peux dérouler le menu en cliquant sur le logo principal en haut du menu.
            </p>
            <img src={welcomeCTA} alt="Nouveau fichier" className="absolute md:block hidden w-auto h-64 mx-auto left-20 top-32" />
        </div>
    );
}
