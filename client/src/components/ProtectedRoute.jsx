import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
