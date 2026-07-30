import type { Catalog } from './types';

const catalogCache = new Map<string, Catalog>();

export function registerCatalog(catalog: Catalog): void {
  const catalogId = catalog.$id || catalog.catalogId;
  if (catalogId) {
    catalogCache.set(catalogId, catalog);
  }
}

/**
 * Load catalog by local id or allowlisted remote URL.
 * @param catalogId catalog URL or local:// id
 * @param allowedCatalogIds enterprise allowlist; remote URLs outside the list are rejected
 */
export async function loadCatalog(
  catalogId: string,
  allowedCatalogIds?: string[],
): Promise<Catalog> {
  if (catalogCache.has(catalogId)) {
    return catalogCache.get(catalogId)!;
  }

  if (catalogId.startsWith('local://')) {
    console.warn(
      `Local catalog "${catalogId}" not registered. Use registerCatalog() to register it.`,
    );
    return { $id: catalogId, components: {} };
  }

  const allowRemote =
    !allowedCatalogIds ||
    allowedCatalogIds.length === 0 ||
    allowedCatalogIds.includes(catalogId);

  if (!allowRemote) {
    throw new Error(
      `[XCard] Catalog "${catalogId}" is not in allowedCatalogIds. Rejecting remote fetch for security.`,
    );
  }

  const response = await fetch(catalogId);
  if (!response.ok) {
    throw new Error(`Failed to load catalog from ${catalogId}: ${response.statusText}`);
  }

  const catalog: Catalog = await response.json();
  catalogCache.set(catalogId, catalog);
  return catalog;
}

export function validateComponent(
  catalog: Catalog,
  componentName: string,
  componentProps: Record<string, any>,
): boolean {
  const componentDef = catalog.components?.[componentName];
  if (!componentDef) {
    console.warn(`Component "${componentName}" not found in catalog`);
    return false;
  }
  if (componentDef.required) {
    for (const field of componentDef.required) {
      if (!(field in componentProps)) {
        console.warn(`Missing required field "${field}" for component "${componentName}"`);
        return false;
      }
    }
  }
  return true;
}

export function clearCatalogCache(): void {
  catalogCache.clear();
}
