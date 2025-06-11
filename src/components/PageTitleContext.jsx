//Context suggéré par Gemini (Google AI) pour la gestion du titre de page
import React, { createContext, useState, useContext } from 'react';

// 1. Création du Context
export const PageTitleContext = createContext(null);

// 2. Création d'un Provider personnalisé
export const PageTitleProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState('Chargement...'); // Titre par défaut

    return (
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
};

// 3. Hook personnalisé pour une utilisation plus simple dans les composants
export const usePageTitle = () => {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error('usePageTitle must be used within a PageTitleProvider');
    }
    return context;
};
