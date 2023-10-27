import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loading from '../templates/Loading';
import { GetAverageRating } from '../detail/Feedback';
import { jsonServer } from '../constant/Constant';

export default function TopView() {
    const [movies, setMovies] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch(jsonServer + '/movies')
            .then(res => res.json())
            .then(movieData => {
                fetch(jsonServer + '/showtimes')
                    .then(res => res.json())
                    .then(showtimeData => {
                        fetch(jsonServer + '/tickets')
                            .then(res => res.json())
                            .then(ticketData => {
                                // Combine data to create a map of movies and their ticket counts
                                const movieTicketCounts = {};

                                ticketData.forEach(ticket => {
                                    const showtime = showtimeData.find(
                                        showtime =>
                                            showtime.id === ticket.showtime_id
                                    );
                                    if (showtime) {
                                        const movie = movieData.find(
                                            movie =>
                                                movie.id === showtime.movie_id
                                        );
                                        if (movie) {
                                            if (movieTicketCounts[movie.id]) {
                                                movieTicketCounts[movie.id]++;
                                            } else {
                                                movieTicketCounts[movie.id] = 1;
                                            }
                                        }
                                    }
                                });

                                // Convert the map to an array of movie objects with ticket counts
                                const moviesWithTicketCounts = Object.keys(
                                    movieTicketCounts
                                ).map(movieId => {
                                    const movie = movieData.find(
                                        movie => movie.id === movieId
                                    );
                                    return {
                                        ...movie,
                                        ticketCount: movieTicketCounts[movieId],
                                    };
                                });

                                // Sort movies based on ticket counts (descending order)
                                moviesWithTicketCounts.sort(
                                    (a, b) => b.ticketCount - a.ticketCount
                                );

                                // Get the top 5 movies with the most tickets
                                const top5Movies = moviesWithTicketCounts.slice(
                                    0,
                                    5
                                );

                                // Set the state with the top 5 movies
                                setMovies(
                                    top5Movies.filter(movie => {
                                        const currentDate = new Date();
                                        const startDate = new Date(
                                            movie.start_date
                                        );
                                        const endDate = new Date(
                                            movie.end_date
                                        );

                                        return (
                                            startDate <= currentDate &&
                                            currentDate <= endDate &&
                                            movie.status === '1'
                                        );
                                    })
                                );
                                setDataLoaded(true);
                            });
                    });
            });
    }, []);

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="product__sidebar">
                    <div className="product__sidebar__view">
                        <div className="section-title">
                            <h5>Top Views</h5>
                        </div>
                        <div>
                            {movies.map(movie => (
                                <div
                                    className="product__sidebar__view__item set-bg mix day years"
                                    style={{
                                        backgroundImage: `url("${movie.banner_image_path}")`,
                                    }}
                                    key={movie.id}
                                >
                                    <div className="ep">Now Showing</div>
                                    <GetAverageRating movieId={movie.id} />
                                    <h5>
                                        <Link to={`/movie-detail/${movie.id}`}>
                                            {movie.movie_name}
                                        </Link>
                                    </h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
