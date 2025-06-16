import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Star,
    StickyNote,
    Trash2,
    LogOut,
    Zap,
    ListTodo
} from "lucide-react";
import LogoIcon from "@/components/common/LogoIcon";
import LogoFull from "@/components/common/LogoFull";
import { logout } from "../utils/auth";

// IA-1-CODE : Explication et correction (ajout de /app) path par ChatGPT (OpenAI)
const links = [
    { to: "/app/dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/app/favorites", label: "Favoris", icon: <Star className="w-5 h-5" /> },
    { to: "/app/notes", label: "Toutes les notes", icon: <StickyNote className="w-5 h-5" /> },
    { to: "/app/all-flash", label: "Toutes les flashcards", icon: <Zap className="w-5 h-5" /> },
    { to: "/app/all-quiz", label: "Toutes des corrections", icon: <ListTodo className="w-5 h-5" /> },
    { to: "/app/trash", label: "Corbeille", icon: <Trash2 className="w-5 h-5" /> },
];

// Le composant Sidebar reçoit maintenant les props de MainLayout
export default function Sidebar({ isSidebarOpen, isDesktopView, isDesktopSidebarCollapsed, toggleSidebar, toggleDesktopSidebarCollapse }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // pas de /app vers on va a la landing page
    };

    const handleMouseEnter = () => {
        if (isDesktopView && isDesktopSidebarCollapsed) {
            toggleDesktopSidebarCollapse();
        }
    };

    const handleMouseLeave = () => {
        if (isDesktopView && !isDesktopSidebarCollapsed) {
            toggleDesktopSidebarCollapse(); // set collapsed à true
        }
    };

    const expanded = isDesktopView && !isDesktopSidebarCollapsed;

    const sidebarClasses = isDesktopView
        ? `${expanded ? "w-64" : "w-16"} sticky top-0 h-screen transition-all duration-300`
        : `fixed inset-y-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`;

    // Cette fonction gère le comportement du clic sur le logo/icône
    const handleLogoClick = () => {
        if (isDesktopView) {
            toggleDesktopSidebarCollapse();
        } else {
            if (isSidebarOpen) {
                toggleSidebar();
            }
        }
    };

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`${sidebarClasses} bg-slate-200 flex flex-col justify-between`}
        >
            <div className="py-4 flex flex-col items-center">
                <div
                    className={`mb-6 flex items-center h-10 transition-all ${isDesktopSidebarCollapsed && isDesktopView ? "justify-center w-10 h-10 transition-all" : ""}`}
                    onClick={() => navigate("/app/dashboard")}
                    role="button"
                    tabIndex={0} // Rend focusable pour l'accessibilité
                    onKeyDown={(e) => e.key === "Enter" && handleLogoClick()} // Gère l'événement clavier
                >
                    {isDesktopSidebarCollapsed && isDesktopView ? (
                        <LogoIcon className="w-8 h-8 fill-violet-600 transition-all duration-300" />
                    ) : (
                        // Sur mobile, c'est toujours le LogoFull qui s'affiche quand la sidebar est ouverte.
                        // Sur desktop, c'est le LogoFull si la sidebar n'est PAS réduite.
                        <LogoFull className="w-24 h-auto fill-violet-600 transition-all duration-300 delay-150" />
                    )}
                </div>

                <nav className={`flex flex-col space-y-2 w-full px-2 ${isDesktopSidebarCollapsed && isDesktopView // Si desktop et réduit
                    ? "justify-center items-center" // Centrage des liens en mode réduit desktop
                    : ""
                                        }`}>
                    {links.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center ${isDesktopSidebarCollapsed && isDesktopView ? "justify-center w-10 h-10" : "" // Centrage icône en mode réduit desktop
                                } p-2 rounded hover:bg-slate-300 transition ${isActive ? "bg-slate-300 font-bold" : "text-slate-900"
                                } ${!isDesktopView ? "w-full" : "" // Prendre toute la largeur en mobile
                                }`
                            }
                            onClick={!isDesktopView ? toggleSidebar : undefined} // Ferme la sidebar sur mobile si on clique sur un lien
                        >
                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                {icon}
                            </div>
                            {/* Le texte du lien est masqué si la sidebar est réduite sur desktop, ou si c'est mobile */}
                            {(isDesktopView ? expanded : true) && (
                                <span
                                    className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out transform ${isDesktopView && isDesktopSidebarCollapsed
                                            ? "opacity-0 -translate-x-2 pointer-events-none"
                                            : "opacity-100 translate-x-0"
                                        }`}
                                >
                                    {label}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="pb-4 flex flex-col items-center w-full px-2">
                <div
                    onClick={handleLogout}
                    role="button"
                    className={`cursor-pointer hover:text-violet-600 flex justify-center items-center px-3 py-2 rounded font-medium transition text-slate-400 ${isDesktopSidebarCollapsed && isDesktopView ? "justify-center" : ""
                        } ${!isDesktopView ? "w-full" : "" // Prendre toute la largeur en mobile
                        }`}
                >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <LogOut className="w-5 h-5" />
                    </div>

                    {expanded && (
                        <span className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out transform ${expanded
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 pointer-events-none"
                            }`}>
                            Se déconnecter
                        </span>
                    )}
                </div>
            </div>
        </aside>
    );
}
