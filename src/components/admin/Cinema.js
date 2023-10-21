import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useScript from '../../UseScript';
import Loading from './template/Loading';

const CinemaManage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/cinemas')
            .then(res => res.json())
            .then(data => {
                setCinemas(data);
                setDataLoaded(true);
            });
    }, []);

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
                <h1 className="h3 mb-2 text-gray-800">Manage Cinema</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Cinema
                        </h6>
                        <Link to="/cinema-manage/create">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New Cinema
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
                                        <th>Cinema Name</th>
                                        <th>Theater Name</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cinemas.map(cinema => (
                                        <tr key={cinema.id}>
                                            <td>{cinema.cinema_name}</td>
                                            <td>
                                                {
                                                    theaters.find(
                                                        theater =>
                                                            theater.id ===
                                                            cinema.theater_id
                                                    )?.theater_name
                                                }
                                            </td>
                                            <td>
                                                {cinema.status === '1'
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/cinema-manage/delete/${cinema.id}`}
                                                >
                                                    Delete
                                                </Link>{' '}
                                                |{' '}
                                                <Link
                                                    to={`/cinema-manage/edit/${cinema.id}`}
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

const CinemaCreate = () => {
    const [cinema, setCinema] = useState({
        cinema_name: '',
        theater_id: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(true);
    const [theaters, setTheaters] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    const handleInputChange = e => {};

    const handleSubmit = async e => {};

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                    Create New Cinema
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-cinema-name">
                                    Cinema Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-cinema-name"
                                    name="cinema_name"
                                    onChange={handleInputChange}
                                    value={cinema.cinema_name}
                                    placeholder="Enter cinema name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-cinema-theater">
                                    Theater Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={cinema.theater_id}
                                    required
                                >
                                    <option>Choose theater</option>
                                    {theaters.map(theater => (
                                        <option
                                            key={theater.id}
                                            value={theater.id}
                                        >
                                            {theater.theater_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-cinema-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={cinema.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
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
                                        to="/movie-manage"
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Back to movie
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

export { CinemaManage, CinemaCreate };
