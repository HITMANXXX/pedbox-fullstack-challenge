export const typeColorsMap: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-500 text-white',
  grass: 'bg-green-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-orange-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-300 text-gray-900',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-yellow-800 text-white',
  ghost: 'bg-indigo-700 text-white',
  dragon: 'bg-indigo-600 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

export const POKEMON_TYPES = Object.keys(typeColorsMap);

export const getTypeColors = (type: string): string => {
  const normalizedType = type.toLowerCase();
  return typeColorsMap[normalizedType] || 'bg-gray-200 text-gray-800';
};
