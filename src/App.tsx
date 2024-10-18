// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { LoginForm } from './pages/Login';
import { SignUpForm } from './pages/SignUp';
import { AuthProvider } from './components/AuthContext';
import AuthListener from './components/AuthListener';
import PrivateRoute from './components/PrivateRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-100 w-full grid justify-items-center border-4 border-zinc-300'>
        <Router>
          <AuthListener />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            {/* <Route path="/signup" element={<SignUpForm />} /> */}
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
