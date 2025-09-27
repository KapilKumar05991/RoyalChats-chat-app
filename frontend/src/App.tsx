import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Login from "./pages/Login";
import useAuthStore from "./store/auth-store";
import { lazy, Suspense, useEffect } from "react";
import Loading from "./components/Loading";

const Layout = lazy(() => import("./components/Layout"))
const Home = lazy(() => import("./pages/Home"))
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"))

function App() {
  const { authenticate, isLoggedIn, loading } = useAuthStore(state => state)

  useEffect(() => {
    authenticate()
  }, [])

  if (!isLoggedIn && loading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to='/login' />} />
            <Route path="/edit" element={isLoggedIn ? <EditProfilePage /> : <Navigate to='/login' />} />
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to='/' />} />
            <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to='/' />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter >
  )
}

export default App
