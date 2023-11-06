import { useNavigate } from 'react-router-dom';
import UserContext from '../authen/UserContext';
import { useContext } from 'react';

export default function Welcome() {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    return (
        <div className="container-fluid d-flex justify-content-center">
            <h1 className="h3 mb-4 text-gray-800">Welcome</h1>
        </div>
    );
}
