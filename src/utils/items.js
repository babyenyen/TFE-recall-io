//IA-1-CODE: Suppression et restauration d'items avec logique de cascade et intelligente suggérée par ChatGPT (OpenAI)
// Suppression récursive : dossier + tous ses descendants
export function deleteItemCascade(id, allItems) {
    const toDelete = new Set();

    function collectDescendants(currentId) {
        toDelete.add(currentId);
        allItems
            .filter((item) => item.parentId === currentId)
            .forEach((child) => collectDescendants(child.id));
    }

    collectDescendants(id);

    return allItems.map((item) =>
        toDelete.has(item.id) ? { ...item, deleted: true } : item
    );
}

// Suppression intelligente : fichier => simple, dossier => en cascade
export function deleteItemSmart(id, allItems) {
    const target = allItems.find(item => item.id === id);
    if (!target) return allItems;

    if (target.type === "folder") {
        return deleteItemCascade(id, allItems);
    }

    return allItems.map((item) =>
        item.id === id ? { ...item, deleted: true } : item
    );
}

export function restoreItemCascade(id, allItems) {
    const toRestore = new Set();

    function collectDescendants(currentId) {
        toRestore.add(currentId);
        allItems
            .filter((item) => item.parentId === currentId)
            .forEach((child) => collectDescendants(child.id));
    }

    collectDescendants(id);

    return allItems.map((item) =>
        toRestore.has(item.id) ? { ...item, deleted: false } : item
    );
}

export function restoreItemSmart(id, allItems) {
    const target = allItems.find(item => item.id === id);
    if (!target) return allItems;

    if (target.type === "folder") {
        return restoreItemCascade(id, allItems);
    }

    return allItems.map((item) =>
        item.id === id ? { ...item, deleted: false } : item
    );
}
