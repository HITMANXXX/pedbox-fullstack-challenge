import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-red-500 py-8 text-center shadow-inner">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md p-2">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
              alt="Pokébola" 
              className="h-full w-full object-contain" 
              style={{ imageRendering: 'pixelated' }} 
            />
          </div>
          <h2 className="font-pokemon mt-2 text-sm text-white tracking-widest drop-shadow-md">NUEVO ENTRENADOR</h2>
        </div>
        
        <div className="p-8">
          {error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-extrabold text-gray-700 uppercase tracking-wide">Entrenador (Email)</label>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 outline-none transition-colors focus:border-red-500 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ash@kanto.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-extrabold text-gray-700 uppercase tracking-wide">Contraseña secreta</label>
              <input
                type="password"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 outline-none transition-colors focus:border-red-500 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-red-500 px-4 py-4 text-lg font-black text-white uppercase tracking-wider transition-transform active:scale-95 hover:bg-red-600 shadow-lg hover:shadow-red-500/50"
            >
              ¡Regístrate ahora!
            </button>
          </form>
          <p className="mt-6 text-center text-sm font-bold text-gray-500">
            ¿Ya tienes cuenta? <Link to="/login" className="text-red-500 hover:text-red-600 hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
