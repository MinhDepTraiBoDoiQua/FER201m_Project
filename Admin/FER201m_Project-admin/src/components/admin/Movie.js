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
import CustomEditor from './template/SunEditor';
import UserContext from './authen/UserContext';
import { useContext } from 'react';

const MovieManage = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [movies, setMovies] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/movies')
            .then(res => res.json())
            .then(data => {
                setMovies(data);
                setDataLoaded(true);
            });
    }, []);

    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage Movie</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Movie
                        </h6>
                        <Link to="/movie-manage/create">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New Movie
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
                                        <th>Cover Image</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map(movie => (
                                        <tr key={movie.id}>
                                            <td>
                                                <img
                                                    src={movie.cover_image_path}
                                                    alt="cover movie"
                                                    className="rounded mx-auto d-block"
                                                    width="200px"
                                                />
                                            </td>
                                            <td>{movie.movie_name}</td>
                                            <td>
                                                {movie.start_date} to{' '}
                                                {movie.end_date}
                                            </td>
                                            <td>
                                                {movie.status === '1'
                                                    ? 'Show'
                                                    : 'Hide'}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/movie-manage/delete/${movie.id}`}
                                                >
                                                    Delete
                                                </Link>{' '}
                                                |{' '}
                                                <Link
                                                    to={`/movie-manage/edit/${movie.id}`}
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
};

const MovieCreate = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [img, setImg] = useState(null);
    const [imgBanner, setImgBanner] = useState(null);
    const [movie, setMovie] = useState({
        movie_name: '',
        movie_description: '',
        genre: '',
        cover_image_path: '',
        trailer_link: '',
        duration: '',
        start_date: '',
        end_date: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(true);

    const handleInputChange = e => {
        e.persist();
        if (e.target.name !== 'movie_description') {
            setMovie(prevMovie => ({
                ...prevMovie,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleInputSunEditorChange = content => {
        setMovie(prevMovie => ({
            ...prevMovie,
            movie_description: content,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setDataLoaded(false);

        let updatedMovie = { ...movie };
        if (img) {
            try {
                const imgRef = ref(storage, `uploads/movies/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);

                // Set the image URL in your movie data
                // setMovie({ ...movie, cover_image_path: imgUrl });

                updatedMovie = { ...movie, cover_image_path: imgUrl };
            } catch (error) {
                window.alert('Error uploading cover image:', error);
            }
        } else {
            setDataLoaded(true);
            window.alert('Please select cover image');
        }

        if (imgBanner) {
            setDataLoaded(false);
            try {
                const imgRef = ref(storage, `uploads/movies/${v4()}`);
                await uploadBytes(imgRef, imgBanner);
                const imgUrl = await getDownloadURL(imgRef);

                // Set the image URL in your movie data
                // setMovie({ ...movie, cover_image_path: imgUrl });

                updatedMovie = {
                    ...updatedMovie,
                    banner_image_path: imgUrl,
                };

                // Continue with the rest of your form submission logic
                await fetch('http://localhost:3000/movies', {
                    method: 'POST',
                    body: JSON.stringify(updatedMovie),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                        setDataLoaded(true);
                        window.location.href = '/movie-manage';
                    });
            } catch (error) {
                window.alert('Error uploading banner image:', error);
            }
        } else {
            setDataLoaded(true);
            window.alert('Please select banner image');
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                    Create New Movie
                </h1>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-movie-name">
                                    Movie Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-movie-name"
                                    name="movie_name"
                                    onChange={handleInputChange}
                                    value={movie.movie_name}
                                    placeholder="Enter movie name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-movie-description">
                                    Movie Description
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <CustomEditor
                                    id="input-movie-description"
                                    name="movie_description"
                                    onChange={handleInputSunEditorChange}
                                    setContents={movie.movie_description}
                                    placeholder="Please type here..."
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-duration">
                                    Movie Duration (minutes)
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="input-movie-duration"
                                    name="duration"
                                    placeholder="Enter duration"
                                    onChange={handleInputChange}
                                    value={movie.duration}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-category">
                                    Movie Category
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="genre"
                                    id="input-movie-category"
                                    className="form-control"
                                    placeholder="Enter category"
                                    onChange={handleInputChange}
                                    value={movie.genre}
                                    required
                                ></input>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-showing">
                                    Showing Schedule
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="input-movie-showing"
                                    name="start_date"
                                    onChange={handleInputChange}
                                    value={movie.start_date}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-end">
                                    End Date
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="input-movie-end"
                                    name="end_date"
                                    onChange={handleInputChange}
                                    value={movie.end_date}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-trailer">
                                    Trailer Link
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="trailer_link"
                                    id="input-movie-trailer"
                                    className="form-control"
                                    placeholder="Enter trailer link"
                                    value={movie.trailer_link}
                                    onChange={handleInputChange}
                                    required
                                ></input>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-image">
                                    Cover Image
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="cover_image_path"
                                    onChange={e => setImg(e.target.files[0])}
                                    className="form-control-file"
                                    id="input-movie-image"
                                />
                            </div>

                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={movie.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-banner-image">
                                    Banner Image
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="banner_image_path"
                                    onChange={e =>
                                        setImgBanner(e.target.files[0])
                                    }
                                    className="form-control-file"
                                    id="input-movie-banner-image"
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
};

const MovieEdit = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    const [movie, setMovie] = useState({
        movie_name: '',
        movie_description: '',
        genre: '',
        cover_image_path: '',
        banner_image_path: '',
        trailer_link: '',
        duration: '',
        start_date: '',
        end_date: '',
        status: '',
    });

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/movies/${id}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [img, setImg] = useState(null);
    const [imgBanner, setImgBanner] = useState(null);

    const handleInputChange = e => {
        e.persist();
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleInputSunEditorChange = content => {
        setMovie({ ...movie, movie_description: content });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let updatedMovie = { ...movie };
            let oldMovie = { ...movie };
            setDataLoaded(false);
            if (img) {
                const imgRef = ref(storage, `uploads/movies/${v4()}`);
                await uploadBytes(imgRef, img);
                const imgUrl = await getDownloadURL(imgRef);
                updatedMovie = { ...movie, cover_image_path: imgUrl };

                try {
                    const oldImgRef = ref(storage, oldMovie.cover_image_path);
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

            if (imgBanner) {
                const imgRef = ref(storage, `uploads/movies/${v4()}`);
                await uploadBytes(imgRef, imgBanner);
                const imgUrl = await getDownloadURL(imgRef);
                updatedMovie = { ...updatedMovie, banner_image_path: imgUrl };

                try {
                    const oldImgRef = ref(storage, oldMovie.banner_image_path);
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

            fetch(`http://localhost:3000/movies/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedMovie),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then(response => response.json())
                .then(json => {
                    setDataLoaded(true);
                    window.location.href = `/movie-manage`;
                });
        } catch (error) {
            setDataLoaded(true);
            console.error('Error uploading image:', error);
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                    Edit Movie: {movie.movie_name}
                </h1>
                <div className="row justify-content-center row">
                    <div className="col-md-5">
                        <img
                            src={movie.cover_image_path}
                            alt="cover movie"
                            className="rounded mx-auto d-block"
                            width="80%"
                            style={{ paddingBottom: '20px' }}
                        />
                        {movie.banner_image_path && (
                            <img
                                src={movie.banner_image_path}
                                alt="cover movie"
                                className="rounded mx-auto d-block"
                                width="80%"
                                style={{ paddingBottom: '20px' }}
                            />
                        )}
                    </div>
                    <div className="col-md-5">
                        <form className="row" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-movie-name">
                                    Movie Name
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="input-movie-name"
                                    name="movie_name"
                                    onChange={handleInputChange}
                                    value={movie.movie_name}
                                    placeholder="Enter movie name"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-12">
                                <label htmlFor="input-movie-description">
                                    Movie Description
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <CustomEditor
                                    id="input-movie-description"
                                    name="movie_description"
                                    onChange={handleInputSunEditorChange}
                                    setContents={movie.movie_description}
                                    placeholder="Please type here..."
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-duration">
                                    Movie Duration (minutes)
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="input-movie-duration"
                                    name="duration"
                                    placeholder="Enter duration"
                                    onChange={handleInputChange}
                                    value={movie.duration}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-category">
                                    Movie Category
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="genre"
                                    id="input-movie-category"
                                    className="form-control"
                                    placeholder="Enter category"
                                    onChange={handleInputChange}
                                    value={movie.genre}
                                    required
                                ></input>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-showing">
                                    Showing Schedule
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="input-movie-showing"
                                    name="start_date"
                                    onChange={handleInputChange}
                                    value={movie.start_date}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-end">
                                    End Date
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="input-movie-end"
                                    name="end_date"
                                    onChange={handleInputChange}
                                    value={movie.end_date}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-trailer">
                                    Trailer Link
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="trailer_link"
                                    id="input-movie-trailer"
                                    className="form-control"
                                    placeholder="Enter trailer link"
                                    value={movie.trailer_link}
                                    onChange={handleInputChange}
                                    required
                                ></input>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-image">
                                    Cover Image
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="cover_image_path"
                                    onChange={e => setImg(e.target.files[0])}
                                    className="form-control-file"
                                    id="input-movie-image"
                                />
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-status">
                                    Status
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={movie.status}
                                    required
                                >
                                    <option>Choose status</option>
                                    <option value="1">Show</option>
                                    <option value="0">Hide</option>
                                </select>
                            </div>
                            <div className="form-group mb-4 col-md-6">
                                <label htmlFor="input-movie-banner-image">
                                    Banner Image
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    name="banner_image_path"
                                    onChange={e =>
                                        setImgBanner(e.target.files[0])
                                    }
                                    className="form-control-file"
                                    id="input-movie-banner-image"
                                />
                            </div>
                            <div className="col-md-6 mb-4 d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Update
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
};

const MovieDelete = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();
    useEffect(() => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            fetch(`http://localhost:3000/movies/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        window.alert('Movie deleted successfully.');
                        window.location.href = '/movie-manage';
                    }
                })
                .catch(error => {
                    window.alert(
                        'Failed to delete the movie. Please try again later.'
                    );
                });
        } else {
            window.location.href = '/movie-manage';
        }
    }, [id]);
};

export { MovieManage, MovieCreate, MovieEdit, MovieDelete };
