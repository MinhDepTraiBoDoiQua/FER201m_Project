import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loading from '../templates/Loading';
import { GetAverageRating } from '../detail/Feedback';
import { jsonServer } from '../constant/Constant';

export default function Showing() {
    const [movies, setMovies] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetch(jsonServer + '/movies')
            .then(res => res.json())
            .then(data => {
                setMovies(data);
                setDataLoaded(true);
            });
    }, []);

    useEffect(() => {
        fetch(jsonServer + '/feedbacks')
            .then(res => res.json())
            .then(data => {
                setFeedbacks(data);
            });
    }, []);

    let nowShowingMovies = [];

    if (dataLoaded) {
        // Get the current date
        const currentDate = new Date();

        nowShowingMovies = movies.filter(movie => {
            const startDate = new Date(movie.start_date);
            const endDate = new Date(movie.end_date);

            return (
                startDate <= currentDate &&
                currentDate <= endDate &&
                movie.status === '1'
            );
        });
    }

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="trending__product">
                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-sm-8">
                            <div className="section-title">
                                <h4>Now Showing</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {nowShowingMovies.map(movie => (
                            <div
                                className="col-lg-4 col-md-6 col-sm-6"
                                key={movie.id}
                            >
                                <div className="product__item">
                                    <div
                                        className="product__item__pic set-bg"
                                        style={{
                                            backgroundImage: `url('${movie.cover_image_path}')`,
                                        }}
                                    >
                                        {/* <div className="ep">Now Showing</div> */}
                                        <div className="comment">
                                            <i className="fa fa-comments"></i>{' '}
                                            {
                                                feedbacks.filter(
                                                    feedback =>
                                                        feedback.movie_id ===
                                                        movie.id
                                                ).length
                                            }
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
