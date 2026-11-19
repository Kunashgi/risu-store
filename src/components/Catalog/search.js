// Búsqueda que ignora tildes y mayúsculas, y busca todas las palabras en nombre + descripción
const normalize = (s = '') =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const searchProducts = (products, query) => {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const haystack = normalize(`${p.name} ${p.description} ${p.keywords || ''}`);
    return words.every((w) => haystack.includes(w));
  });
};
