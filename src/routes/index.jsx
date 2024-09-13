import { createBrowserRouter } from 'react-router-dom';
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-password/:token',
                element: <ResetPassword />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            }
        ]
    }
]);

export default router;