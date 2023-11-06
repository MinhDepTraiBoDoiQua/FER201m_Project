import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../authen/Breadcrumb';
import Login from '../authen/Login';
import { useState } from 'react';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import Loading from '../templates/Loading';

const ChangePassword = ({ account }) => {
    const [acc, setAcc] = useState(account);

    const [dataLoaded, setDataLoaded] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInputChange = e => {
        e.persist();
        if (e.target.name === 'password') {
            setPassword(e.target.value);
            if (e.target.value !== account.password) {
                setErrorMessage('Your current password is incorrect!');
            } else {
                setErrorMessage('');
            }
        }
        if (e.target.name === 'newPassword') {
            setNewPassword(e.target.value);
            setAcc({ ...acc, ['password']: e.target.value });
            if (e.target.value !== confirmPassword) {
                setErrorMessage(
                    'New password and confirm password are not match!'
                );
            } else if (e.target.value === password) {
                setErrorMessage(
                    'New password and current password are the same!'
                );
            } else {
                setErrorMessage('');
            }
        }
        if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
            if (e.target.value !== newPassword) {
                setErrorMessage(
                    'New password and confirm password are not match!'
                );
            } else if (newPassword === password) {
                setErrorMessage(
                    'New password and current password are the same!'
                );
            } else {
                setErrorMessage('');
            }
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        setDataLoaded(false);

        if (
            errorMessage === '' &&
            newPassword !== '' &&
            password !== '' &&
            confirmPassword !== ''
        ) {
            axios
                .put(jsonServer + '/accounts/' + account.id, acc)
                .then(function (response) {
                    setDataLoaded(true);
                    window.location.href = '/profile';
                })
                .catch(function (error) {
                    console.log(error);
                    setDataLoaded(true);
                });
        } else {
            setDataLoaded(true);
            alert('Please check your input!');
        }
    };

    if (!account) {
        return <Login />;
    }

    if (!dataLoaded) {
        return <Loading />;
    }

    return (
        <div>
            <Breadcrumb title="Profile" />
            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <form onSubmit={handleSubmit}>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Your curent password"
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="New password"
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm new password"
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_profile"></span>
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div className="row">
                                            <Link
                                                to="/profile"
                                                className="col-lg-6"
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                >
                                                    Back
                                                </button>
                                            </Link>

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div
                                className="blog__details__comment__item"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <div className="">
                                    <img
                                        src="https://media.makeameme.org/created/if-you-change-34df2bb397.jpg"
                                        alt=""
                                        style={{
                                            width: '400px',
                                        }}
                                    />
                                </div>

                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    <h3 style={{ color: 'white' }}>Fun Fact</h3>
                                </div>
                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    {/* <input
                                        type="file"
                                        style={{ color: 'white' }}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export { ChangePassword };
