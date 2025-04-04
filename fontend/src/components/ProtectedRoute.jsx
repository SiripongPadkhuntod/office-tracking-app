import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // console.log("ProtectedRoute: currentUser:", currentUser);
  // console.log("ProtectedRoute: loading:", loading);

  if (loading) {
    return <Loading />;
  }

  // รอให้ currentUser ถูกโหลดก่อน redirect
  if (!loading && !currentUser) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
