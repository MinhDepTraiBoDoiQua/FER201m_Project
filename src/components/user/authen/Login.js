import Breadcrumb from './Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import UserContext from './UserContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // logout();

    const handleSubmit = async e => {
        e.preventDefault();

        await axios
            .get(
                `${jsonServer}/accounts?email=${email}&password=${password}&user_type=3`
            )
            .then(function (response) {
                const account = response.data[0];
                if (response.data.length === 0) {
                    setErrorMessage('Email or password is incorrect!');
                } else {
                    setErrorMessage('');
                    login(account.email, account.id);
                    // alert('Login success');
                    navigate('/');
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {});
    };

    return (
        <div>
            <Breadcrumb title={'Login'} />

            {/* Login Section */}
            <section className="login spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <h3>Login</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="input__item">
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            onChange={e =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            onChange={e =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <span className="icon_lock"></span>
                                    </div>
                                    {errorMessage && (
                                        <div
                                            className="alert alert-danger"
                                            style={{ width: '370px' }}
                                            role="alert"
                                        >
                                            {errorMessage}
                                        </div>
                                    )}
                                    <button type="submit" className="site-btn">
                                        Login Now
                                    </button>
                                </form>
                                <Link to="/" className="forget_pass">
                                    Forgot Your Password?
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login__register">
                                <h3>Dont’t Have An Account?</h3>
                                <Link to="/signup" className="primary-btn">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
