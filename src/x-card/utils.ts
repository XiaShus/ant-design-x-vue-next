/** Get value from nested object by path, path format like /booking/date */
export function getValueByPath(obj: Record<string, any>, path: string): any {
  const parts = path.replace(/^\//, '').split('/');
  return parts.reduce((cur, key) => (cur != null ? cur[key] : undefined), obj as any);
}

/** Write value to nested object by path (immutable) */
export function setValueByPath(
  obj: Record<string, any>,
  path: string,
  value: any,
): Record<string, any> {
  const parts = path.replace(/^\//, '').split('/');
  const next = { ...obj };
  let cur: Record<string, any> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ? { ...cur[parts[i]] } : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}

export function isPathValue(val: any): val is string {
  return typeof val === 'string' && val.startsWith('/');
}

export function isPathObject(val: any): val is { path: string } {
  return val !== null && typeof val === 'object' && typeof val.path === 'string';
}

export function validateComponentAgainstCatalog(
  catalog: any,
  componentName: string,
  componentProps: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!catalog?.components) {
    return { valid: true, errors: [] };
  }

  const componentDef = catalog.components[componentName];
  if (!componentDef) {
    errors.push(`Component "${componentName}" is not defined in catalog`);
    return { valid: false, errors };
  }

  const requiredFields = componentDef.required || [];
  for (const field of requiredFields) {
    if (!(field in componentProps)) {
      errors.push(`Missing required field "${field}" for component "${componentName}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}
