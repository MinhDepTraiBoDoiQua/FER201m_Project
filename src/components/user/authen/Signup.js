import { Link } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const [account, setAccount] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        avatar_image_path:
            'https://herrmans.eu/wp-content/uploads/2019/01/765-default-avatar.png',
        status: '1',
        user_type: '3',
    });

    const handleInputChange = e => {
        const { name, value } = e.target;
        setAccount({ ...account, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMessage('');
        if (
            account.firstName === '' ||
            account.lastName === '' ||
            account.email === '' ||
            account.username === '' ||
            account.password === ''
        ) {
            setErrorMessage('Please fill out all fields!');
        } else {
            axios
                .get('http://localhost:3000/accounts')
                .then(function (response) {
                    const accounts = response.data;
                    const isExistUsername = accounts.find(
                        acc => account.username === acc.username
                    );
                    const isExistEmail = accounts.find(
                        acc => account.email === acc.email
                    );
                    if (isExistUsername || isExistEmail) {
                        setErrorMessage('Username or email is already exist!');
                    } else {
                        axios
                            .post('http://localhost:3000/accounts', account)
                            .then(function (response) {
                                const accId = response.data.id;
                                axios.post('http://localhost:3000/users', {
                                    account_id: accId,
                                });
                                setErrorMessage('');
                                alert('Signup success');
                                window.location.href = '/login';
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
        }
    };

    return (
        <div>
            <Breadcrumb title={'Signup'} />

            {/* Signup section */}
            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <h3>Sign Up</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            name="firstName"
                                            value={account.firstName}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_chat"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            name="lastName"
                                            value={account.lastName}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_chat"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            name="email"
                                            value={account.email}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            name="username"
                                            value={account.username}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_target"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={account.password}
                                            onChange={handleInputChange}
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
                                    <button type="submit" class="site-btn">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login__register">
                                <h3>Have An Account?</h3>
                                <Link to="/login" class="primary-btn">
                                    Login Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Signup;
