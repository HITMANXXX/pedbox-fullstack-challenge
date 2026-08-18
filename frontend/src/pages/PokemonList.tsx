import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { getTypeColors } from '../utils/typeColors';

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

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/pokemon?page=${page}&limit=12`);
        setPokemons(response.data.data);
        setMeta(response.data.meta);
      } catch (err) {
        setError('Error al cargar la lista de Pokémon.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-inner">
              <div className="h-4 w-4 rounded-full bg-white"></div>
            </div>
            <h1 className="font-pokemon text-2xl text-gray-800 md:text-3xl">Pokédex</h1>
          </div>
          <button 
            onClick={logout}
            className="rounded-xl bg-gray-800 px-6 py-3 font-bold text-white shadow-md transition-all active:scale-95 hover:bg-gray-900"
          >
            Cerrar sesión
          </button>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-6 text-center font-bold text-red-600 shadow-sm">
            {error}
          </div>
        )}

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
                  className="group flex cursor-pointer flex-col items-center overflow-hidden rounded-3xl bg-white p-6 shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gray-50 transition-colors duration-300 group-hover:bg-blue-50">
                    <span className="absolute right-2 top-2 font-black text-gray-300 opacity-50 group-hover:text-blue-200">
                      #{String(pokemon.id).padStart(3, '0')}
                    </span>
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
              <div className="mt-12 flex items-center justify-center gap-6 rounded-3xl bg-white p-6 shadow-md">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  Anterior
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-gray-400 uppercase">Página</span>
                  <span className="font-pokemon text-xl text-gray-800">{meta.page} / {meta.lastPage}</span>
                </div>
                <button
                  onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                  disabled={page === meta.lastPage}
                  className="flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-600 disabled:pointer-events-none disabled:opacity-40"
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
