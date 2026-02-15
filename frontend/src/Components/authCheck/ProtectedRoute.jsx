import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isLoading, children }) => {
  const location = useLocation();

  // ✅ WAIT until auth check finishes
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
