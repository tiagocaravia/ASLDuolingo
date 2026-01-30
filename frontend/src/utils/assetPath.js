export function getAssetPath(path) {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith('/')) {
    return base + path.slice(1);
  }
  return base + path;
}
