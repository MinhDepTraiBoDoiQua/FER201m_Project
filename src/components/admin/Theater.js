import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useScript from '../../UseScript';
import { storage } from '../../firebaseImage/Config';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { v4 } from 'uuid';
import Loading from './template/Loading';
import UserContext from './authen/UserContext';
import { useContext } from 'react';

const TheaterManage = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [theaters, setTheaters] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage Theater</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Theater
                        </h6>
                        <Link to="/theater-manage/create">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New Theater
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
                                        <th>Theater Name</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {theaters.map(theater => (
                                        <tr key={theater.id}>
                                            <td>{theater.theater_name}</td>
                                            <td>{theater.location}</td>
                                            <td>
                                                {theater.status === '1'
                                                    ? 'Show'
                                                    : 'Hide'}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/theater-manage/delete/${theater.id}`}
                                                >
                                                    Delete
                                                </Link>{' '}
                                                |{' '}
                                                <Link
                                                    to={`/theater-manage/edit/${theater.id}`}
                                                >
                                                    Edit
                                                </Link>
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

const TheaterCreate = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [img, setImg] = useState(null);
    const [theater, setTheater] = useState({
        theater_name: '',
        location: '',
        theater_image_path: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(true);

    const handleInputChange = e => {
        e.persist();
        setTheater({ ...theater, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setDataLoaded(false);

        if (img) {
            try {
                const imgRef = ref(storage, `uploads/theaters/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);

                const updateTheater = {
                    ...theater,
                    theater_image_path: imgUrl,
                };

                await fetch('http://localhost:3000/theaters', {
                    method: 'POST',
                    body: JSON.stringify(updateTheater),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                        setDataLoaded(true);
                        window.location.href = '/theater-manage';
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
                    Create New Theater
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-name">
                                    Theater Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-theater-name"
                                    name="theater_name"
                                    onChange={handleInputChange}
                                    value={theater.theater_name}
                                    placeholder="Enter theater name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-location">
                                    Theater Location
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-theater-location"
                                    name="location"
                                    onChange={handleInputChange}
                                    value={theater.location}
                                    placeholder="Enter theater location"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={theater.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-image">
                                    Theater Image
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
                                        to="/theater-manage"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Back to theater
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

const TheaterEdit = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    const [theater, setTheater] = useState({
        theater_name: '',
        location: '',
        theater_image_path: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/theaters/${id}`)
            .then(res => res.json())
            .then(data => {
                setTheater(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [img, setImg] = useState(null);

    const handleInputChange = e => {
        e.persist();
        setTheater({ ...theater, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let updatedTheater = { ...theater };
            let oldTheaterData = { ...theater };
            setDataLoaded(false);
            if (img) {
                const imgRef = ref(storage, `uploads/theaters/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);
                updatedTheater = { ...theater, theater_image_path: imgUrl };

                if (oldTheaterData.theater_image_path) {
                    const oldImgRef = ref(
                        storage,
                        oldTheaterData.theater_image_path
                    );
                    await deleteObject(oldImgRef);
                }
            }

            fetch(`http://localhost:3000/theaters/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTheater),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then(response => response.json())
                .then(json => {
                    setDataLoaded(true);
                    window.location.href = '/theater-manage';
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
                    Edit Theater {theater.theater_name}
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <img
                            src={theater.theater_image_path}
                            alt="cover theater"
                            className="rounded mx-auto d-block"
                            width="80%"
                            style={{ paddingBottom: '20px' }}
                        />
                    </div>
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-name">
                                    Theater Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-theater-name"
                                    name="theater_name"
                                    onChange={handleInputChange}
                                    value={theater.theater_name}
                                    placeholder="Enter theater name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-location">
                                    Theater Location
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-theater-location"
                                    name="location"
                                    onChange={handleInputChange}
                                    value={theater.location}
                                    placeholder="Enter theater location"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={theater.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-theater-image">
                                    Theater Image
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
                                        to="/theater-manage"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Back to theater
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

const TheaterDelete = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    useEffect(() => {
        if (window.confirm('Are you sure you want to delete this theater?')) {
            fetch(`http://localhost:3000/theaters/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(json => {
                    window.location.href = '/theater-manage';
                })
                .catch(error => {
                    window.alert(
                        'Failed to delete the theater. Please try again later.'
                    );
                });
        } else {
            window.location.href = '/theater-manage';
        }
    }, [id]);
};

export { TheaterManage, TheaterCreate, TheaterEdit, TheaterDelete };
