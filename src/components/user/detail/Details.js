import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../templates/Loading';
import { jsonServer } from '../constant/Constant';
import Modal from 'react-modal';

const StarRating = ({ averageRating, maxRating = 5 }) => {
    // Calculate the number of full stars and the possible half-star
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - fullStars >= 0.5;

    // Create an array of star elements based on the calculated values
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<i key={i} className="fa fa-star"></i>);
    }

    if (hasHalfStar) {
        stars.push(<i key="half" className="fa fa-star-half-o"></i>);
    }

    // Fill the remaining slots with empty stars
    while (stars.length < maxRating) {
        stars.push(<i key={stars.length} className="fa fa-star-o"></i>);
    }

    return (
        <div className="rating">
            {stars.map((star, index) => (
                <Link to="#" key={index}>
                    {star}
                </Link>
            ))}
        </div>
    );
};

export default function Details({ timeSelected }) {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [status, setStatus] = useState('');
    useEffect(() => {
        fetch(`${jsonServer}/movies/${id}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setDataLoaded(true);
            });
        const currentDate = new Date();
        const startDate = new Date(movie.start_date);
        const endDate = new Date(movie.end_date);
        if (startDate > currentDate) {
            setStatus('Coming soon');
        } else if (startDate <= currentDate && currentDate <= endDate) {
            setStatus('Now Showing');
        } else {
            setStatus('End Showing');
        }
    }, [id, movie.end_date, movie.start_date]);

    const [feedbacks, setFeedbacks] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    const handleBooking = e => {
        if (!timeSelected) {
            e.preventDefault();
            window.alert('Please select a time');
        }
    };

    useEffect(() => {
        fetch(jsonServer + '/feedbacks?movie_id=' + id)
            .then(res => res.json())
            .then(data => {
                setFeedbacks(data);
            });
    }, [id]);

    useEffect(() => {
        if (feedbacks.length > 0) {
            let sum = 0;
            feedbacks.forEach(feedback => {
                sum += Number(feedback.rating);
            });
            const avgRating = (sum / feedbacks.length).toFixed(1);
            setAverageRating(avgRating);
        } else {
            setAverageRating(0);
        }
    }, [feedbacks]);

    // Trailer modal
    const [modal, setModal] = useState(false);
    const showTrailer = () => {
        setModal(true);
    };

    const closeTrailer = () => {
        setModal(false);
    };

    // if (modal) {
    //     document.body.classList.add('active-modal');
    // } else {
    //     document.body.classList.remove('active-modal');
    // }

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <>
                {/* SHow Trailer */}
                <div className="container" style={{ width: '50%' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <Modal
                                isOpen={modal}
                                onRequestClose={closeTrailer}
                                contentLabel="Example Modal"
                                ariaHideApp={false}
                                style={{
                                    content: {
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '100%',
                                        maxWidth: '642px',
                                        height: '48%',
                                        padding: '0',
                                        background: 'white',
                                        overflowY: 'hidden',
                                    },
                                }}
                            >
                                <div
                                    className="trailer"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <iframe
                                        id="player"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        src={`${movie.trailer_link}?autoplay=1&mute=1`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>

                <div className="anime__details__content">
                    <div className="row">
                        <div className="col-lg-3">
                            <div
                                className="anime__details__pic set-bg"
                                style={{
                                    backgroundImage: `url('${movie.cover_image_path}')`,
                                }}
                            >
                                {/* <div className="comment">
                                    <i className="fa fa-comments"></i> 11
                                </div>
                                <div className="view">
                                    <i className="fa fa-eye"></i> 9141
                                </div> */}
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="anime__details__text">
                                <div className="anime__details__title">
                                    <h3>{movie.movie_name}</h3>
                                </div>
                                <div className="anime__details__rating">
                                    <StarRating averageRating={averageRating} />
                                    <span>{feedbacks.length} Feedbacks</span>
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: movie.movie_description,
                                        background: '#0b0c2a',
                                        color: '#fff',
                                    }}
                                ></div>
                                <div className="anime__details__widget">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <ul>
                                                <li>
                                                    <span>Genre:</span>{' '}
                                                    {movie.genre}
                                                </li>
                                                <li>
                                                    <span>Duration:</span>{' '}
                                                    {movie.duration} minutes
                                                </li>
                                                <li>
                                                    <span>Status</span> {status}
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <ul>
                                                <li>
                                                    <span>Start Date</span>{' '}
                                                    {movie.start_date}
                                                </li>
                                                <li>
                                                    <span>End Date</span>{' '}
                                                    {movie.end_date}
                                                </li>
                                                <li>
                                                    <span>Rating:</span>{' '}
                                                    {averageRating} / 5
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="anime__details__btn">
                                    <Link
                                        to="#"
                                        className="follow-btn"
                                        onClick={showTrailer}
                                    >
                                        Trailer
                                    </Link>
                                    <Link
                                        to={`/booking?movie_id=${id}&time=${timeSelected}`}
                                        className="watch-btn"
                                        onClick={handleBooking}
                                    >
                                        <span>Booking Now</span>{' '}
                                        <i className="fa fa-angle-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
