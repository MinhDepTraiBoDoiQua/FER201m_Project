import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import UserContext from '../authen/UserContext';
import Login from '../authen/Login';
import Loading from '../template/Loading';

const ChangePassword = () => {
    const { accountId } = useContext(UserContext);

    const [account, setAccount] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        axios
            .get(`${jsonServer}/accounts/${accountId}`)
            .then(res => {
                setAccount(res.data);
                setDataLoaded(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [accountId]);

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
            setAccount({ ...account, [`password`]: e.target.value });
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
                .put(`${jsonServer}/accounts/${accountId}`, account)
                .then(res => {
                    setDataLoaded(true);
                    alert('Your password has been changed!');
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
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Change your Password
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-first-name">
                                Enter Your Current Password
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-current-password"
                                name="password"
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-last-name">
                                Enter Your New Password
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-new-password"
                                name="newPassword"
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-email">
                                Enter Your New Password Again
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="input-confirm-password"
                                name="confirmPassword"
                                onChange={handleInputChange}
                                placeholder="Enter new password again"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12 d-flex justify-content-center">
                            {errorMessage && (
                                <div
                                    className="alert alert-danger"
                                    style={{ width: '370px' }}
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div className="col-md-12 mb-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
