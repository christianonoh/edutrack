// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { LoginForm } from './pages/Login';
// import { SignUpForm } from './pages/SignUp';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-100 w-full grid justify-items-center border-zinc-300'>
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Navigate to="/login" />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<AdminDashboard />} />
            </Route>
            </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
