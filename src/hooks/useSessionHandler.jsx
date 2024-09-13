import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/userSlice.js';
import toastr from 'toastr';

const useSessionHandler = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSessionClosure = (message) => {
        localStorage.removeItem('token');
        dispatch(setUserDetails(null));
        toastr.info(message);
        navigate('/');
    };

    return { handleSessionClosure };
};

export default useSessionHandler;