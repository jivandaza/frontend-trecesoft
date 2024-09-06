import { createBrowserRouter } from 'react-router-dom';
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import NewPassword from "../pages/NewPassword.jsx";

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
                path: 'forgot-password?token=',
                element: <NewPassword />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            }
        ]
    }
]);

export default router;