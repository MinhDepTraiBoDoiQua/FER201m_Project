import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loading from '../templates/Loading';
import { jsonServer } from '../constant/Constant';

export default function Banner() {
    const [movies, setMovies] = useState([]);
    const [adsBanner, setAdsBanner] = useState([]);
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

    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/adsBanner')
            .then(res => res.json())
            .then(data => {
                setAdsBanner(data);
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
                <section className="hero">
                    <div className="container">
                        <Carousel fade>
                            {comingSoonMovies.map(movie => (
                                <Carousel.Item key={`movie-${movie.id}`}>
                                    <Link to={`/movie-detail/${movie.id}`}>
                                        <div
                                            style={{
                                                overflow: 'hidden',
                                                maxHeight: '500px',
                                            }}
                                        >
                                            <img
                                                className="d-block w-100 rounded-lg"
                                                src={movie.banner_image_path}
                                                alt="Cover movie"
                                            />
                                        </div>
                                    </Link>
                                </Carousel.Item>
                            ))}
                            {adsBanner.map(ads => (
                                <Carousel.Item key={`ads-${ads.id}`}>
                                    <a href={ads.ads_link}>
                                        <div
                                            style={{
                                                overflow: 'hidden',
                                                maxHeight: '500px',
                                            }}
                                        >
                                            <img
                                                className="d-block w-100 rounded-lg"
                                                src={ads.ads_banner_image_path}
                                                alt="Cover movie"
                                            />
                                        </div>
                                    </a>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </section>
            </>
        );
    }
}
