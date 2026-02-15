import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Components/Home"
import Login from "./Components/Login"
import SignUp from "./Components/Signup"
import AppSkeleton from "./Components/AppSkeleton"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import ProtectedRoute from "./Components/authCheck/ProtectedRoute"
import { fetchChats } from "./Store/slices/chatSlice"
import { checkAuth } from "./Store/slices/authSlice"


const App = () => {

  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((store) => store.auth);


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchChats());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])


  if (isLoading && isAuthenticated === null) {
  return <AppSkeleton />;
}

  return (
    <>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <Home />
            </ProtectedRoute>}
          />
        </Routes>
      </div>
    </>
  )
}

export default App
