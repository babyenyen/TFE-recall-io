import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeLabels = {
    favorites: "Favoris",
    notes: "Toutes les notes",
    trash: "Corbeille",
    file: "",    // ignorer
    folder: "",  // ignorer
    flashcards: "Flashcards",
    quiz: "Quiz"
};

function buildBreadcrumbTrail(currentId, items) {
    const trail = [];
    let current = items.find((item) => item.id === currentId);

    while (current) {
        trail.unshift({
            label: current.name,
            path: `/app/${current.type}/${current.id}`,
        });
        current = items.find((item) => item.id === current.parentId);
    }

    return trail;
}

export default function Breadcrumb({ items = [] }) {
    const location = useLocation();
    const { id } = useParams();

    const segments = location.pathname.split("/").filter(Boolean);

    const IGNORED_SEGMENTS = ["app", "dashboard", "folder", "file"];

    let crumbs = [];

    // Cas page fichier ou dossier : on reconstruit dynamiquement les parents
    if (
        segments.some((seg) => ["file", "folder", "flashcards", "quiz"].includes(seg)) &&
        id &&
        items.length > 0
    ) {
        crumbs = buildBreadcrumbTrail(id, items);

        const lastSegment = segments.at(-1);
        if (["flashcards", "quiz"].includes(lastSegment)) {
            crumbs.push({
                label: routeLabels[lastSegment] || lastSegment,
                path: location.pathname,
            });
        }
    }

    return (
        <nav className="text-sm mb-4 mt-2 flex flex-wrap text-nowrap items-center text-slate-600">
            <Link to="/app/dashboard" className="hover:underline">Tableau de bord</Link>
            {crumbs.map((crumb, index) => (
                <span key={crumb.path} className="flex items-center">
                    <ChevronRight className="inline w-4 h-4 mx-1" />
                    {index === crumbs.length - 1 ? (
                        <span className="text-slate-700 font-medium">{crumb.label}</span>
                    ) : (
                        <Link to={crumb.path} className="hover:underline">{crumb.label}</Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
