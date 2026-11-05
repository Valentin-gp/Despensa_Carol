import Admin from './pages/Admin';
import Site from './pages/Site';

export default function App() {
  return window.location.pathname.startsWith('/admin') ? <Admin /> : <Site />;
}
