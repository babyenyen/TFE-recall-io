import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-x-hidden pt-12 md:px-20 min-w-0">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}
