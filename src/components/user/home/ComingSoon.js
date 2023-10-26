import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loading from '../templates/Loading';
import { GetAverageRating } from '../detail/Feedback';

export default function ComingSoon() {
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

    let comingSoonMovies = [];

    if (dataLoaded) {
        // Get the current date
        const currentDate = new Date();

        comingSoonMovies = movies.filter(movie => {
            const startDate = new Date(movie.start_date);

            return startDate > currentDate && movie.status === '1';
        });
    }
    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="popular__product">
                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-sm-8">
                            <div className="section-title">
                                <h4>Coming Soon</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {comingSoonMovies.map(movie => (
                            <div
                                className="col-lg-4 col-md-6 col-sm-6"
                                key={movie.id}
                            >
                                {' '}
                                {/* Add a unique 'key' prop */}
                                <div className="product__item">
                                    <div
                                        className="product__item__pic set-bg"
                                        style={{
                                            backgroundImage: `url('${movie.cover_image_path}')`,
                                        }}
                                    >
                                        {/* <div className="ep">Coming Soon</div> */}
                                        <div className="comment">
                                            <i className="fa fa-comments"></i>{' '}
                                            11
                                        </div>
                                        <GetAverageRating movieId={movie.id} />
                                    </div>
                                    <div className="product__item__text">
                                        <ul>
                                            {movie.genre
                                                .split(',')
                                                .map((genre, index) => (
                                                    <li key={index}>{genre}</li>
                                                ))}
                                        </ul>
                                        <h5>
                                            <Link
                                                to={`/movie-detail/${movie.id}`}
                                            >
                                                {movie.movie_name}
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}
