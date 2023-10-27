import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import UserContext from '../authen/UserContext';
import Loading from '../template/Loading';
import { storage } from '../../../firebaseImage/Config';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { v4 } from 'uuid';

const Profile = () => {
    const { accountId } = useContext(UserContext);
    const navigate = useNavigate();

    const [img, setImg] = useState(null);
    const [account, setAccount] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
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
        setAccount({ ...account, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let updateAccount = { ...account };
            let oldAccount = { ...account };
            setDataLoaded(false);
            if (img) {
                const imgRef = ref(storage, `uploads/avatar/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgURL = await getDownloadURL(imgRef);
                updateAccount.avatar_image_path = imgURL;

                try {
                    const oldImgRef = ref(
                        storage,
                        oldAccount.avatar_image_path
                    );
                    await deleteObject(oldImgRef);
                } catch (error) {
                    if (error.code === 'storage/object-not-found') {
                        console.log(
                            'Image not found in Firebase Storage. No action taken.'
                        );
                    } else {
                        console.error(
                            'Error checking or deleting image:',
                            error
                        );
                    }
                }
            }

            axios
                .put(`${jsonServer}/accounts/${accountId}`, updateAccount)
                .then(res => {
                    setDataLoaded(true);
                    navigate('/profile');
                })
                .catch(function (error) {
                    console.log(error);
                    setDataLoaded(true);
                });
        } catch (error) {
            setDataLoaded(true);
            console.error('Error uploading image:', error);
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    }
    if (!account) {
        window.location.href = '/login';
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                {account.firstName} {account.lastName} Profile
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-5 ">
                    <div className="mb-4 d-flex justify-content-center">
                        <img
                            src={account.avatar_image_path}
                            alt="cover avatart"
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                // paddingBottom: '20px',
                            }}
                        />
                    </div>
                    <div className="mb-4 d-flex justify-content-center">
                        <Link
                            to="/profile/change-password"
                            className="btn btn-primary"
                        >
                            Click here to change password
                        </Link>
                    </div>
                </div>
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-first-name">
                                First Name
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-theater-name"
                                name="firstName"
                                value={account.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-last-name">
                                Last Name
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-theater-name"
                                value={account.lastName}
                                name="lastName"
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-email">
                                Email
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="input-email"
                                name="email"
                                value={account.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-username">
                                Username
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-username"
                                value={account.username}
                                name="username"
                                onChange={handleInputChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-theater-image">
                                Avatar Image
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="file"
                                name="theater_image_path"
                                onChange={e => setImg(e.target.files[0])}
                                className="form-control-file"
                                id="input-theater-image"
                            />
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

export default Profile;
