import { useEffect, useState } from 'react';
import { ApiError, adminLogin, adminLogout, adminMe } from '../lib/api';

export default function Admin() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminMe().then((r) => setAuth(r.authenticated)).catch(() => setAuth(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminLogin(key);
      setKey('');
      setAuth(true);
    } catch (err) {
      setError(err instanceof ApiError ? (err.code === 'ADMIN_NOT_CONFIGURED' ? 'El acceso de administrador todavía no está configurado.' : err.message) : 'Error de conexión.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await adminLogout().catch(() => undefined);
    setAuth(false);
  }

  if (auth === null) return <main className="splash">Cargando…</main>;

  return (
    <main className="splash admin">
      <img src="/logo.png" alt="Despensa Carol" width={158} height={120} />
      <h1>Administración</h1>
      {auth ? (
        <>
          <p>Sesión iniciada. El panel para editar datos y promociones es el próximo paso del proyecto.</p>
          <div className="actions">
            <a className="btn" href="/">
              Ver el sitio
            </a>
            <button className="btn btn--soft" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={login} className="admin__form">
          <label htmlFor="key">Clave de acceso</label>
          <input id="key" type="password" autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={busy || !key}>
            Entrar
          </button>
        </form>
      )}
    </main>
  );
}
