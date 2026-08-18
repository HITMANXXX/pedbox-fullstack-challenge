import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { getTypeColors } from '../utils/typeColors';

interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  spriteImageUrl: string;
  types: { name: string }[];
}

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/pokemon/${id}`, {
          signal: controller.signal
        });
        setPokemon(response.data);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.message === 'canceled') {
          return;
        }
        if (err.response?.status === 404) {
          setError('¡Pokémon no encontrado!');
        } else {
          setError('Error al cargar los detalles del Pokémon.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemon();
    }
    
    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al listado
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">{error}</h2>
            <Link to="/" className="text-blue-600 hover:underline">Regresar al inicio</Link>
          </div>
        )}

        {loading && !error && (
          <div className="flex h-96 items-center justify-center rounded-2xl bg-white shadow-md">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-blue-600"></div>
          </div>
        )}

        {!loading && !error && pokemon && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
            {/* Header / Image Area */}
            <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
              <span className="absolute right-8 top-8 text-4xl font-black text-blue-900/10">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
              
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white/50 shadow-inner backdrop-blur-sm">
                <img 
                  src={pokemon.spriteImageUrl} 
                  alt={pokemon.name} 
                  className="h-48 w-48 object-contain drop-shadow-2xl"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 text-center sm:p-12">
              <h1 className="mb-6 text-5xl font-black capitalize tracking-tight text-gray-900">
                {pokemon.name}
              </h1>
              
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {pokemon.types.map((t, idx) => (
                  <span 
                    key={idx} 
                    className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest shadow-sm ${getTypeColors(t.name)}`}
                  >
                    {t.name}
                  </span>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-6 sm:gap-8 sm:p-8">
                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
                  <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">Altura</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {pokemon.height / 10} m
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
                  <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">Peso</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {pokemon.weight / 10} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
