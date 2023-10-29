import Breadcrumb from '../authen/Breadcrumb';
import Loading from '../templates/Loading';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../authen/UserContext';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';
import { Link, useParams } from 'react-router-dom';

function getDayOfWeek(date) {
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return daysOfWeek[date.getDay()];
}

// Chuyển đổi ngày thành định dạng "DD/MM"
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Chuyển đổi giờ thành định dạng "HH:MM"
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const MyTicket = () => {
    const { orderId } = useParams();
    // const { accountId } = useContext(UserContext);
    // const [userId, setUserId] = useState(null);
    // useEffect(() => {
    //     if (accountId !== null && accountId !== '0') {
    //         axios
    //             .get(`${jsonServer}/users?account_id=${accountId}`)
    //             .then(function (response) {
    //                 setUserId(response.data[0].id);
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             });
    //     }
    // }, [accountId]);

    const [tickets, setTickets] = useState([]);
    const [showtime, setShowtime] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/tickets?order_id=' + orderId)
            .then(res => res.json())
            .then(data => {
                setTickets(data);
                fetch(jsonServer + '/showtimes/' + data[0].showtime_id)
                    .then(res => res.json())
                    .then(data => {
                        setShowtime(data);
                    });
            });
    }, [orderId]);

    const [order, setOrder] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/orders/' + orderId)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
            });
    }, [orderId]);
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/movies')
            .then(res => res.json())
            .then(data => {
                setMovies(data);
            });
    }, []);
    const [isImageShow, setIsImageShow] = useState(true);
    const handleCoverImage = () => {
        const coverImage = document.querySelectorAll('.cover-image');
        console.log(coverImage);
        if (isImageShow) {
            coverImage.forEach(image => {
                image.style.backgroundImage = 'none';
                image.style.backgroundColor = '#28282a';
            });
        } else {
            coverImage.forEach(image => {
                image.style.backgroundImage =
                    'url(' +
                    movies.find(movie => movie.id === order.movie_id)
                        ?.cover_image_path +
                    ')';
            });
        }
        setIsImageShow(!isImageShow);
    };

    const startTime = new Date(showtime.start_time);
    const endTime = new Date(showtime.end_time);
    const isMoiveEnd = Date.now() > endTime.getTime();
    const formattedDate = getDayOfWeek(startTime) + ' ' + formatDate(startTime);

    const formattedTime = formatTime(startTime) + ' - ' + formatTime(endTime);

    return (
        <div>
            <Breadcrumb title={'My Ticket'} />
            <section className="blog spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3
                                className="text-center"
                                style={{ color: 'white', marginBottom: '30px' }}
                            >
                                My Ticket ({isMoiveEnd ? 'Expired' : 'Valid'})
                            </h3>
                            <div className="row">
                                {tickets.map(ticket => (
                                    <div className="col-lg-4" key={ticket.id}>
                                        <div
                                            className="blog__item set-bg cover-image"
                                            style={{
                                                backgroundImage: `url(${
                                                    movies.find(
                                                        movie =>
                                                            movie.id ===
                                                            order.movie_id
                                                    )?.cover_image_path
                                                })`,
                                                textShadow:
                                                    '2px 2px 4px #000000',
                                                color: 'white',
                                            }}
                                        >
                                            <div className="blog__item__text">
                                                <p>
                                                    <span className="icon_calendar"></span>{' '}
                                                    {formattedDate}
                                                </p>
                                                <div className="anime__details__title">
                                                    <span>Movie name</span>
                                                    <h3>
                                                        {
                                                            movies.find(
                                                                movie =>
                                                                    movie.id ===
                                                                    order.movie_id
                                                            )?.movie_name
                                                        }
                                                    </h3>
                                                </div>
                                                <div className="anime__details__title">
                                                    <span>Day</span>
                                                    <h3>
                                                        {
                                                            formattedDate.split(
                                                                ' '
                                                            )[0]
                                                        }
                                                    </h3>
                                                </div>
                                                <div className="anime__details__title">
                                                    <span>Time</span>
                                                    <h3>{formattedTime}</h3>
                                                </div>
                                                <div className="anime__details__title">
                                                    <span>Seat</span>
                                                    <h3>{ticket.seat_name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="col-lg-12 d-flex justify-content-center"
                                style={{
                                    marginTop: '30px',
                                }}
                            >
                                <Link to="/order">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                    >
                                        Back To My Order
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleCoverImage}
                                >
                                    {isImageShow
                                        ? 'Hide Cover Image'
                                        : 'Show Cover Image'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export { MyTicket };
