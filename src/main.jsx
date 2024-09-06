import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './store/store.js';
import router from './routes/index.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <Provider store={store} >
        <RouterProvider router={router} />
    </Provider>
)
