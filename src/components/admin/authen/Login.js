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
            .get(`${jsonServer}/accounts?email=${email}&password=${password}`)
            .then(function (response) {
                const account = response.data[0];

                if (response.data.length === 0 || account.user_type === '3') {
                    setErrorMessage('Email or password is incorrect!');
                } else {
                    setErrorMessage('');
                    login(account.email, account.id);
                    window.location.href = '/';
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {});
    };

    return (
        <div className="bg-gradient-primary" style={{ height: '100vh' }}>
            <div className="container">
                {/* Outer Row */}
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                {/* Nested Row within Card Body */}
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">
                                                    Welcome Back!
                                                </h1>
                                            </div>
                                            <form
                                                className="user"
                                                onSubmit={handleSubmit}
                                            >
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-user"
                                                        id="exampleInputEmail"
                                                        aria-description="emailHelp"
                                                        placeholder="Enter Email Address..."
                                                        onChange={e =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        className="form-control form-control-user"
                                                        id="exampleInputPassword"
                                                        placeholder="Password"
                                                        onChange={e =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                {errorMessage && (
                                                    <div
                                                        className="alert alert-danger"
                                                        role="alert"
                                                    >
                                                        {errorMessage}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-user btn-block"
                                                >
                                                    Login
                                                </button>
                                                <hr />
                                                <h3
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Don’t Have An Account?
                                                </h3>
                                                <Link
                                                    to="https://www.facebook.com/MinhDepTraiSo01/"
                                                    className="btn btn-facebook btn-user btn-block"
                                                >
                                                    <i className="fab fa-facebook-f fa-fw"></i>{' '}
                                                    Contact admin to create an
                                                    account
                                                </Link>
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <Link
                                                    className="small"
                                                    to="/forget-password"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
