import Breadcrumb from '../authen/Breadcrumb';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import UserContext from '../authen/UserContext';
import Login from '../authen/Login';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import Loading from '../templates/Loading';
import { storage } from '../firebaseImage/Config';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';

const Profile = ({ account }) => {
    const { logout } = useContext(UserContext);
    if (!account) {
        return <Login />;
    }

    const handleLogout = () => {
        logout();
        return <Login />;
    };

    return (
        <div>
            <Breadcrumb title="Profile" />
            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <form>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={account.firstName}
                                            readOnly
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={account.lastName}
                                            readOnly
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={account.username}
                                            readOnly
                                        />
                                        <span className="icon_profile"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Email address"
                                            value={account.email}
                                            readOnly
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <div>
                                        <Link to="/profile/edit">
                                            Click Here to edit profile
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/profile/change-password">
                                            Click Here to change password
                                        </Link>
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
                                        src={`${account.avatar_image_path}`}
                                        alt=""
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                        }}
                                    />
                                </div>

                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    <h3 style={{ color: 'white' }}>
                                        {account.firstName} {account.lastName}
                                    </h3>
                                </div>
                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    {/* <input
                                        type="file"
                                        style={{ color: 'white' }}
                                    /> */}
                                    <Link
                                        as="button"
                                        to="/logout"
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ProfileEdit = ({ account }) => {
    const [acc, setAcc] = useState(account);
    const [img, setImg] = useState(null);

    const [dataLoaded, setDataLoaded] = useState(true);

    const handleInputChange = e => {
        e.persist();
        setAcc({ ...acc, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let updateAcc = { ...acc };
            let oldAcc = { ...acc };
            setDataLoaded(false);
            if (img) {
                const uuid = require('uuid');
                const imgRef = ref(storage, `uploads/avatar/${uuid.v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);
                updateAcc = { ...updateAcc, avatar_image_path: imgUrl };

                try {
                    const oldImgRef = ref(storage, oldAcc.avatar_image_path);
                    await deleteObject(oldImgRef);
                } catch (error) {
                    if (error.code === 'storage/object-not-found') {
                        console.log(
                            'Image not found in Firebase Storage. No action taken.'
                        );
                    } else {
                        // Handle other errors, if any
                        console.error(
                            'Error checking or deleting image:',
                            error
                        );
                    }
                }
            }

            axios
                .put(jsonServer + '/accounts/' + account.id, updateAcc)
                .then(function (response) {
                    setDataLoaded(true);
                    window.location.href = '/profile';
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

    if (!account) {
        return <Login />;
    }
    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div>
            <Breadcrumb title="Edit Profile" />

            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <form>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            name="firstName"
                                            value={acc.firstName}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            name="lastName"
                                            value={acc.lastName}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_info"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            name="username"
                                            value={acc.username}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_profile"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            name="email"
                                            value={acc.email}
                                            onChange={handleInputChange}
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <Link to="/profile">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                        >
                                            Back
                                        </button>
                                    </Link>
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
                                        src={`${acc.avatar_image_path}`}
                                        alt=""
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                        }}
                                    />
                                </div>

                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    <h3 style={{ color: 'white' }}>
                                        {acc.firstName} {acc.lastName}
                                    </h3>
                                </div>
                                <div
                                    className="blog__details__comment__item__text"
                                    style={{ marginTop: '20px' }}
                                >
                                    <input
                                        className="form-control form-control-sm"
                                        type="file"
                                        name="avatar_image_path"
                                        accept="image/*"
                                        onChange={e =>
                                            setImg(e.target.files[0])
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="col-lg-12">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Link
                        as="button"
                        type="submit    "
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        Update
                    </Link>
                </div>
            </div>

            <br />
            <br />
            <br />
        </div>
    );
};

export { Profile, ProfileEdit };
