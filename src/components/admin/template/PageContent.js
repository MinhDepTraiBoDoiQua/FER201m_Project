import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MovieManage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/movies')
            .then(res => res.json())
            .then(data => setMovies(data));
    }, []);
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
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        style={{ float: 'right' }}
                    >
                        <a
                            href="createMovie.html"
                            style={{ textDecoration: 'none' }}
                        >
                            Add New Movie
                        </a>
                    </button>
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
                                            {movie.status == 1
                                                ? 'Show'
                                                : 'Hide'}
                                        </td>
                                        <td>
                                            <Link to="/">Delete</Link> |{' '}
                                            <Link to="/">Edit</Link>
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
