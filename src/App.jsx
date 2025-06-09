import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Notes from "./pages/Notes";
import Trash from "./pages/Trash";
import Folder from "./pages/Folder";
import FilePage from "./pages/FilePage";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import MainLayout from "./layout/MainLayout";
import WelcomePage from "./pages/WelcomePage";

// IA-1-CODE: Explication de Router par ChatGPT (OpenAI)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Layout principal pour l'app */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="notes" element={<Notes />} />
          <Route path="trash" element={<Trash />} />
          <Route path="folder/:id" element={<Folder />} />
          <Route path="file/:id" element={<FilePage />} />
          <Route path="quiz/:id" element={<Quiz />} />
          <Route path="flashcards/:id" element={<Flashcards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
