import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Star,
    StickyNote,
    Trash2,
    LogOut
} from "lucide-react";
import LogoIcon from "@/components/common/LogoIcon";
import LogoFull from "@/components/common/LogoFull";
import { logout } from "../utils/auth";

// IA-1-CODE : Explication et correction (ajout de /app) path par ChatGPT (OpenAI)
const links = [
    { to: "/app/dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/app/favorites", label: "Favoris", icon: <Star className="w-5 h-5" /> },
    { to: "/app/notes", label: "Toutes les notes", icon: <StickyNote className="w-5 h-5" /> },
    { to: "/app/trash", label: "Corbeille", icon: <Trash2 className="w-5 h-5" /> },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem("recall-sidebar-collapsed");
        return saved ? JSON.parse(saved) : true; // true = collapsed par défaut
    });

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // pas de /app ver on va a la landing page
    };

    return (
        <aside
            className={`${collapsed ? "w-16" : "w-56"
                } sticky transition-all duration-300 bg-slate-200 h-full flex flex-col justify-between`}
        >
            <div className="py-4 flex flex-col items-center">
                <div
                    className={`mb-6 flex items-center h-10 transition-all ${collapsed ? "justify-center w-10 h-10 transition-all" : ""}`}
                    onClick={() => {
                        const newState = !collapsed;
                        setCollapsed(newState);
                        localStorage.setItem("recall-sidebar-collapsed", JSON.stringify(newState));
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <LogoIcon className="w-8 h-8 fill-violet-600 transition-all duration-300" />
                    ) : (
                        <LogoFull className="w-24 h-auto ml-4 fill-violet-600 transition-all duration-300 delay-150" />
                    )}
                </div>
                <nav className="flex flex-col space-y-2">
                    {links.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center ${collapsed ? "justify-center w-10 h-10" : ""
                                } p-2 rounded hover:bg-slate-300 transition ${isActive ? "bg-slate-300 font-bold" : "text-slate-900"
                                }`
                            }
                        >
                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                {icon}
                            </div>
                            {!collapsed &&
                                <span
                                    className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out transform ${collapsed
                                        ? "opacity-0 translate-x-[-8px] pointer-events-none"
                                        : "opacity-100 translate-x-0"
                                        }`}
                                >
                                    {label}
                                </span>
                            }
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="pb-4 flex flex-col items-center">
                <div
                    onClick={handleLogout}
                    role="button"
                    className={`cursor-pointer hover:text-violet-600 flex items-center px-3 py-2 rounded font-medium transition text-slate-400 ${collapsed ? "justify-center" : ""
                        }`}
                >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <LogOut className="w-5 h-5" />
                    </div>

                    {!collapsed && <span className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out transform ${collapsed
                        ? "opacity-0 translate-x-[-8px] pointer-events-none"
                        : "opacity-100 translate-x-0"
                        }`}>
                        Se déconnecter
                    </span>}
                </div>
            </div>
        </aside>
    );
}
