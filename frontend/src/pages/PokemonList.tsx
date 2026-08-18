import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { getTypeColors, POKEMON_TYPES } from '../utils/typeColors';

interface Pokemon {
  id: number;
  name: string;
  spriteImageUrl: string;
  types: { name: string }[];
}

interface MetaData {
  total: number;
  page: number;
  lastPage: number;
}

export default function PokemonList() {
  const { logout } = useAuth();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('id-asc');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedType]);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPokemons = async () => {
      setLoading(true);
      setError('');
      try {
        const [sortBy, order] = sortOption.split('-');
        
        const params = new URLSearchParams({
          page: String(page),
          limit: '12',
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(selectedType && { type: selectedType }),
          sortBy,
          order,
        });

        const response = await api.get(`/pokemon?${params.toString()}`, {
          signal: controller.signal
        });
        setPokemons(response.data.data);
        setMeta(response.data.meta);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') {
          setError('Error al cargar la lista de Pokémon.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
    
    return () => {
      controller.abort();
    };
  }, [page, debouncedSearch, selectedType, sortOption]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedType('');
    setSortOption('id-asc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md p-1">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokébola" 
                className="h-full w-full object-contain" 
                style={{ imageRendering: 'pixelated' }} 
              />
            </div>
            <h1 className="font-pokemon text-2xl text-gray-800 md:text-3xl">Pokédex</h1>
          </div>
          <button 
            onClick={logout}
            className="rounded-xl bg-gray-800 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-bold text-white shadow-md transition-all active:scale-95 hover:bg-gray-900"
          >
            Cerrar sesión
          </button>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-6 text-center font-bold text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row w-full">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 outline-none transition-colors focus:border-red-500 focus:bg-white sm:w-1/3"
            />
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 outline-none transition-colors focus:border-red-500 focus:bg-white sm:w-1/3 capitalize"
            >
              <option value="">Todos los Tipos</option>
              {POKEMON_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 outline-none transition-colors focus:border-red-500 focus:bg-white sm:w-1/3"
            >
              <option value="id-asc">Número (#)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center rounded-xl border-2 border-red-500 bg-white px-4 py-3 font-bold text-red-500 shadow-sm transition-all active:scale-95 hover:bg-red-50 md:w-auto w-full whitespace-nowrap"
          >
            Limpiar Filtros
          </button>
        </div>

        {loading ? (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 animate-spin rounded-full border-8 border-gray-200 border-t-red-500 shadow-lg"></div>
            <p className="font-bold text-gray-500">Cargando Pokémon...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {pokemons.map((pokemon) => (
                <Link 
                  key={pokemon.id} 
                  to={`/pokemon/${pokemon.id}`}
                  className="relative group flex cursor-pointer flex-col items-center overflow-hidden rounded-3xl bg-white p-6 shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl"
                >
                  <span className="absolute right-6 top-6 font-black text-gray-300 opacity-50 transition-colors duration-300 group-hover:text-blue-200">
                    #{String(pokemon.id).padStart(3, '0')}
                  </span>
                  <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gray-50 transition-colors duration-300 group-hover:bg-blue-50">
                    <img 
                      src={pokemon.spriteImageUrl} 
                      alt={pokemon.name} 
                      className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-110"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <h2 className="mb-4 text-2xl font-black capitalize text-gray-800">
                    {pokemon.name}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pokemon.types.map((t, idx) => (
                      <span 
                        key={idx} 
                        className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm ${getTypeColors(t.name)}`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {meta && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-3xl bg-white p-4 sm:p-6 shadow-md">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  Anterior
                </button>
                <div className="flex flex-col items-center mx-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">Página</span>
                  <span className="font-pokemon text-lg sm:text-xl text-gray-800">{meta.page} / {meta.lastPage}</span>
                </div>
                <button
                  onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                  disabled={page === meta.lastPage}
                  className="flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
