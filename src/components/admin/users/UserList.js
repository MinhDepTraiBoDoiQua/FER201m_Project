import React, { useEffect, useState } from 'react';
import UserContext from '../authen/UserContext';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import useScript from '../../../UseScript';
import Loading from '../template/Loading';
import { Link } from 'react-router-dom';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { storage } from '../../../firebaseImage/Config';
import { v4 } from 'uuid';
import axios from 'axios';

const handleChange = (id, newStatus) => {
    const updatedStatus = newStatus === '0' ? '1' : '0';
    const buttonText = newStatus === '0' ? 'Ban' : 'Unban';
    fetch('http://localhost:3000/accounts/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: updatedStatus,
        }),
    });
    window.location.reload();
    const buttons = document.querySelectorAll(`[data-id="${id}"]`);
    buttons.forEach(button => {
        button.innerText = buttonText;
    });
};

const UserList = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [accounts, setAccounts] = useState([]);
    const [filterRole, setFilterRole] = useState(0);
    const [filterAccounts, setFilterAccounts] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleFilterRole = e => {
        setFilterRole(e.target.value);
        if (e.target.value == 0) {
            setFilterAccounts(accounts.filter(ac => ac.user_type != 1));
        } else {
            const newFilterAccounts = accounts.filter(
                ac => ac.user_type == e.target.value
            );
            setFilterAccounts(newFilterAccounts);
        }
    };

    useEffect(() => {
        fetch('http://localhost:3000/accounts')
            .then(res => res.json())
            .then(data => {
                setAccounts(data);
                setFilterAccounts(data.filter(ac => ac.user_type != 1));
                setDataLoaded(true);
            });
    }, []);

    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage Account</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Account
                            <select name="role" onChange={handleFilterRole}>
                                <option value={0}>All</option>
                                <option value={3}>User</option>
                                <option value={2}>Movie Manager</option>
                            </select>
                        </h6>
                        <Link to="/account-manage/create-movie-manager">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New Movie Manager Account
                            </button>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterAccounts.map(ac => (
                                        <tr key={ac.id}>
                                            <td>{ac.username}</td>
                                            <td>{ac.email}</td>
                                            <td>
                                                {ac.user_type == 1
                                                    ? 'Admin'
                                                    : ac.user_type == 2
                                                    ? 'Movie Manager'
                                                    : 'User'}
                                            </td>
                                            <td>
                                                {ac.status === '1'
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                        handleChange(
                                                            ac.id,
                                                            ac.status
                                                        )
                                                    }
                                                    data-id={ac.id}
                                                >
                                                    {ac.status === '0'
                                                        ? 'Unban'
                                                        : 'Ban'}
                                                </button>{' '}
                                                {/* |{' '}
                                                <Link
                                                    to={`/account-manage/details/${ac.id}`}
                                                >
                                                    Details
                                                </Link> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const MovieManagerCreate = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [img, setImg] = useState(null);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        avatar_image_path: '',
        status: '',
        user_type: '2',
    });

    const [dataLoaded, setDataLoaded] = useState(true);

    const handleInputChange = e => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setDataLoaded(false);

        if (img) {
            try {
                const imgRef = ref(storage, `uploads/accounts/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);

                const updateUser = {
                    ...user,
                    avatar_image_path: imgUrl,
                };

                await fetch('http://localhost:3000/accounts', {
                    method: 'POST',
                    body: JSON.stringify(updateUser),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                        axios.post('http://localhost:3000/movie-managers', {
                            account_id: json.id,
                        });
                        setDataLoaded(true);
                        window.location.href = '/user-manage';
                    });
            } catch (error) {
                window.alert('Error uploading image:', error);
            }
        } else {
            setDataLoaded(true);
            window.alert('Please select an image');
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                    Create New Movie Manager
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-fName">
                                    First Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-fName"
                                    name="firstName"
                                    onChange={handleInputChange}
                                    value={user.firstName}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-lName">
                                    Last Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-lName"
                                    name="lastName"
                                    onChange={handleInputChange}
                                    value={user.lastName}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-email">
                                    Email
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-email"
                                    name="email"
                                    onChange={handleInputChange}
                                    value={user.email}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-username">
                                    Username
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-username"
                                    name="username"
                                    onChange={handleInputChange}
                                    value={user.username}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={user.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-image">
                                    Avatar
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="avatar_image_path"
                                    onChange={e => setImg(e.target.files[0])}
                                    className="form-control-file"
                                    id="input-theater-image"
                                />
                            </div>
                            <div className="col-md-6 mb-4 d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Create
                                </button>
                            </div>
                            <div className="col-md-6 mb-4">
                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    width="100%"
                                >
                                    <Link
                                        to="/user-manage"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Back to user list
                                    </Link>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

const UserEdit = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        avatar_image_path: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/accounts/${id}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [img, setImg] = useState(null);

    const handleInputChange = e => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let updatedUser = { ...user };
            let oldUserData = { ...user };
            setDataLoaded(false);
            if (img) {
                const imgRef = ref(storage, `uploads/accounts/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);
                updatedUser = { ...user, avatar_image_path: imgUrl };

                if (oldUserData.avatar_image_path) {
                    const oldImgRef = ref(
                        storage,
                        oldUserData.avatar_image_path
                    );
                    await deleteObject(oldImgRef);
                }
            }

            fetch(`http://localhost:3000/accounts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedUser),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then(response => response.json())
                .then(json => {
                    setDataLoaded(true);
                    window.location.href = '/user-manage';
                });
        } catch (error) {
            setDataLoaded(true);
            window.alert('Error uploading image:', error);
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                    Edit User {user.username}
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <img
                            src={user.avatar_image_path}
                            alt="cover theater"
                            className="rounded mx-auto d-block"
                            width="80%"
                            style={{ paddingBottom: '20px' }}
                        />
                    </div>
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-fName">
                                    First Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-fName"
                                    name="firstName"
                                    onChange={handleInputChange}
                                    value={user.firstName}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-lName">
                                    Last Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-lName"
                                    name="lastName"
                                    onChange={handleInputChange}
                                    value={user.lastName}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-email">
                                    Email
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-email"
                                    name="email"
                                    onChange={handleInputChange}
                                    value={user.email}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-username">
                                    Username
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-user-username"
                                    name="username"
                                    onChange={handleInputChange}
                                    value={user.username}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-user-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={user.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-image">
                                    Avatar
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="avatar_image_path"
                                    onChange={e => setImg(e.target.files[0])}
                                    className="form-control-file"
                                    id="input-theater-image"
                                />
                            </div>
                            <div className="col-md-6 mb-4 d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="col-md-6 mb-4">
                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    width="100%"
                                >
                                    <Link
                                        to="/user-manage"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Back to user list
                                    </Link>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

export { UserList, UserEdit, MovieManagerCreate };
