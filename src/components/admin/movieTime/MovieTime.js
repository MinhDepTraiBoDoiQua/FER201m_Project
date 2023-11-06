import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jsonServer } from '../constant/Constant';
import UserContext from '../authen/UserContext';
import Loading from '../template/Loading';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const MovieTimeManage = () => {
    const [movies, setMovies] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/movies')
            .then(res => res.json())
            .then(data => {
                setMovies(data);
                setDataLoaded(true);
            });
    }, []);
    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Movie Time Manage
            </h1>
            {movies.map(movie => (
                <Link key={movie.id} to={`/show-times/detail/${movie.id}`}>
                    {movie.movie_name}
                    <br />
                </Link>
            ))}
        </div>
    );
};

const MovieTimeDetail = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const { id } = useParams();

    const [movie, setMovie] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/movies/' + id)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [showTimes, setShowTimes] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/showTimes')
            .then(res => res.json())
            .then(data => {
                setShowTimes(data);
                setDataLoaded(true);
            });
    }, []);

    const [theaters, setTheaters] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    const [cinemas, setCinemas] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/cinemas')
            .then(res => res.json())
            .then(data => {
                setCinemas(data);
                setDataLoaded(true);
            });
    }, []);

    // useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    // useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Schedule of movie: {movie.movie_name}
            </h1>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6
                        className="m-0 font-weight-bold text-primary"
                        style={{ float: 'left' }}
                    >
                        Show Times
                    </h6>
                    <Link to={`/show-times/detail/${id}/create`}>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            style={{ float: 'right' }}
                        >
                            Add New Show Time
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
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Cinema</th>
                                    <th>Theater</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showTimes.map(showTime => {
                                    if (showTime.movie_id === movie.id) {
                                        return (
                                            <tr key={showTime.id}>
                                                <td>
                                                    {
                                                        showTime?.start_time.split(
                                                            ' '
                                                        )[0]
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        showTime?.start_time.split(
                                                            ' '
                                                        )[1]
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        showTime?.end_time.split(
                                                            ' '
                                                        )[1]
                                                    }
                                                </td>
                                                {cinemas.map(cinema => {
                                                    if (
                                                        cinema?.id ===
                                                        showTime?.cinema_id
                                                    ) {
                                                        return (
                                                            <td
                                                                key={cinema?.id}
                                                            >
                                                                {
                                                                    cinema?.cinema_name
                                                                }
                                                            </td>
                                                        );
                                                    }
                                                })}
                                                {theaters.map(theater => {
                                                    if (
                                                        theater?.id ===
                                                        cinemas?.find(
                                                            cinema =>
                                                                cinema?.id ===
                                                                showTime?.cinema_id
                                                        )?.theater_id
                                                    ) {
                                                        return (
                                                            <td
                                                                key={
                                                                    theater?.id
                                                                }
                                                            >
                                                                {
                                                                    theater?.theater_name
                                                                }
                                                            </td>
                                                        );
                                                    }
                                                })}
                                                <td>
                                                    <Link
                                                        to={`/show-times/delete/${showTime?.id}`}
                                                    >
                                                        Delete
                                                    </Link>{' '}
                                                    |{' '}
                                                    <Link
                                                        to={`/show-times/edit/${showTime?.id}`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MovieTimeCreate = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const { id } = useParams();

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [theaterId, setTheaterId] = useState('0');
    const [cinemaId, setCinemaId] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState('');

    const [movie, setMovie] = useState({});
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/movies/' + id)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [showTimes, setShowTimes] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/showTimes')
            .then(res => res.json())
            .then(data => {
                setShowTimes(data);
                setDataLoaded(true);
            });
    }, []);

    const [theaters, setTheaters] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    const [cinemas, setCinemas] = useState([]);
    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/cinemas?theater_id=' + theaterId)
            .then(res => res.json())
            .then(data => {
                setCinemas(data);
                setDataLoaded(true);
            });
    }, [theaterId]);

    useEffect(() => {
        if (cinemaId === '' || cinemaId === '0') {
            setError('Please select a cinema');
        } else {
            setError('');
        }

        if (startTime !== '' && endTime !== '') {
        }
        if (startTime !== '' && endTime !== '' && theaterId !== '0') {
            let isError = false;
            showTimes.map(showTime => {
                if (
                    showTime.cinema_id === cinemaId &&
                    showTime.status === '1'
                ) {
                    const showTimeStartTime = new Date(showTime.start_time);
                    const showTimeEndTime = new Date(showTime.end_time);
                    const inputStartTime = new Date(startTime);
                    const inputEndTime = new Date(endTime);
                    console.log();

                    if (
                        (inputStartTime >= showTimeStartTime &&
                            inputStartTime <= showTimeEndTime) ||
                        (inputEndTime >= showTimeStartTime &&
                            inputEndTime <= showTimeEndTime)
                    ) {
                        isError = true;
                    }
                }
            });
            if (isError) {
                setError('This cinema is not available at this time');
            } else {
                const inputStartTime = new Date(startTime);
                const inputEndTime = new Date(endTime);
                if (inputStartTime >= inputEndTime) {
                    setError('Start time must be before end time');
                } else {
                    const inputStartDate = new Date(startTime.split(' ')[0]);
                    const inputEndDate = new Date(endTime.split(' ')[0]);
                    const startDate = new Date(movie.start_date);
                    const endDate = new Date(movie.end_date);
                    endDate.setDate(endDate.getDate() + 1);

                    if (inputStartDate < startDate || inputEndDate > endDate) {
                        setError(
                            'Start time and end time must be in the range of the movie showing date'
                        );
                    } else if (cinemaId === '' || cinemaId === '0') {
                        setError('Please select a cinema');
                    } else {
                        setError('');
                    }
                }
            }
        }
    }, [startTime, endTime, theaterId, cinemaId]);

    const navigate = useNavigate();
    const handleSubmit = e => {
        e.preventDefault();

        if (error === '') {
            fetch(jsonServer + '/showTimes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movie_id: id + '',
                    cinema_id: cinemaId + '',
                    start_time: startTime,
                    end_time: endTime,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    alert('Create success');
                    navigate(`/show-times/detail/${id}`);
                    // window.location.href = `/show-times/detail/${id}`;
                });
        }
    };
    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Create New Show Time For Movie: {movie.movie_name}
            </h1>
            <p className="mb-4 text-gray-800 d-flex justify-content-center">
                {movie.start_date} - {movie.end_date}
            </p>
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-status">
                                Theater name
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="status"
                                className="form-control"
                                onChange={e => setTheaterId(e.target.value)}
                                value={theaterId}
                                required
                            >
                                <option value="0">Choose theater</option>
                                {theaters.map(theater => (
                                    <option key={theater.id} value={theater.id}>
                                        {theater.theater_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {cinemas.length > 0 ? (
                            <>
                                <div className="form-group mb-4 col-md-12">
                                    <label htmlFor="input-status">
                                        Cinema name
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        onChange={e =>
                                            setCinemaId(e.target.value)
                                        }
                                        value={cinemaId}
                                        required
                                    >
                                        <option value="0">Choose cinema</option>
                                        {cinemas.map(cinema => (
                                            <option
                                                key={cinema.id}
                                                value={cinema.id}
                                            >
                                                {cinema.cinema_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-4 col-md-12">
                                    <label htmlFor="input-start-time">
                                        Start Time
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="input-start-time"
                                        name="start_time"
                                        onChange={e => {
                                            const inputDate = e.target.value;
                                            const formattedDate =
                                                inputDate.replace('T', ' ') +
                                                ':00';
                                            setStartTime(formattedDate);
                                        }}
                                        value={startTime}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4 col-md-12">
                                    <label htmlFor="input-end-time">
                                        End Time
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="input-end-time"
                                        name="end"
                                        onChange={e => {
                                            const inputDate = e.target.value;
                                            const formattedDate =
                                                inputDate.replace('T', ' ') +
                                                ':00';
                                            setEndTime(formattedDate);
                                        }}
                                        value={endTime}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                        {error && (
                            <div className="form-group mb-4 col-md-12">
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            </div>
                        )}
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Create
                            </button>
                        </div>
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button
                                type="submit"
                                className="btn btn-danger"
                                width="100%"
                            >
                                <Link
                                    to={`/show-times/detail/${id}`}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Back to show time detail
                                </Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const MovieTimeEdit = () => {};

export { MovieTimeManage, MovieTimeDetail, MovieTimeCreate };
