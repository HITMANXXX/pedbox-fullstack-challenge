import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-red-500 py-8 text-center shadow-inner">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-white shadow-md">
            <div className="h-8 w-8 rounded-full border-4 border-gray-200 bg-white shadow-inner"></div>
          </div>
          <h2 className="font-pokemon mt-2 text-sm text-white tracking-widest drop-shadow-md">INGRESA A TU POKÉDEX</h2>
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
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-red-500 px-4 py-4 text-lg font-black text-white uppercase tracking-wider transition-transform active:scale-95 hover:bg-red-600 shadow-lg hover:shadow-red-500/50"
            >
              ¡Atraparlos ya!
            </button>
          </form>
          <p className="mt-6 text-center text-sm font-bold text-gray-500">
            ¿Nuevo entrenador? <Link to="/register" className="text-red-500 hover:text-red-600 hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
