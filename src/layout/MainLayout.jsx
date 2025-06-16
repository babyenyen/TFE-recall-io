import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { PageTitleProvider, usePageTitle } from "@/components/PageTitleContext";
import LogoIcon from "@/components/common/LogoIcon";
import {
    Menu,
    X
} from "lucide-react";

export default function MainLayout() {
    return (
        // Envelopper tout le contenu du layout avec le PageTitleProvider
        <PageTitleProvider>
            <MainLayoutContent />
        </PageTitleProvider>
    );
}

// logique qui gère l'état du layout
function MainLayoutContent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopView, setIsDesktopView] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem("recall-sidebar-collapsed");
        return saved ? JSON.parse(saved) : true;
    });

    // on recupère le titre de la page depuis le hook
    const { pageTitle } = usePageTitle();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDesktopSidebarCollapse = () => {
        const newState = !isDesktopSidebarCollapsed;
        setIsDesktopSidebarCollapsed(newState);
        localStorage.setItem("recall-sidebar-collapsed", JSON.stringify(newState));
    };

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768;
            setIsDesktopView(isDesktop);
            // Si on passe en desktop, ouvre la sidebar par défaut (ou laisse le localStorage décider pour l'état de collapse)
            // Si on passe en mobile, ferme la sidebar par défaut
            setIsSidebarOpen(isDesktop);
        };

        handleResize(); // Appel initial au montage
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []); // Dépendances vides pour que l'effet ne s'exécute qu'une fois au montage/démontage

    const mainContentPaddingClass = isDesktopView
        ? (isDesktopSidebarCollapsed ? "px-16" : "px-8")
        : "";

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isDesktopView={isDesktopView}
                isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                toggleDesktopSidebarCollapse={toggleDesktopSidebarCollapse}
            />

            {!isDesktopView && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${mainContentPaddingClass} overflow-x-hidden overflow-y-auto`}>
                <header className="fixed top-0 left-0 right-0 z-30 bg-slate-100 shadow-sm md:hidden p-4 flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md bg-transparent focus:outline-none"
                    >
                        {!isDesktopView && !isSidebarOpen && (
                            <Menu className="w-7 h-7  transition-all duration-300" />
                        ) || (
                            <Menu className="w-7 h-7 rotate-90 transition-all duration-300" />
                        )}
                    </button>
                    <div className="flex items-center ml-3">
                        <LogoIcon className="inline-block w-6 h-6 mr-2 fill-violet-600" />
                        <h1 className="text-xl text-slate-800 truncate max-w-[300px] overflow-hidden whitespace-nowrap align-middle">
                            {pageTitle}
                        </h1>
                    </div>
                </header>

                <main className="flex-1 pt-16 md:pt-8 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
