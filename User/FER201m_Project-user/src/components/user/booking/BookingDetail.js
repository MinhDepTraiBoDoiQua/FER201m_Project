import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    jsonServer,
    vipSeatsPrice,
    normalSeatsPrice,
} from '../constant/Constant';

import Breadcrumb from '../authen/Breadcrumb';

// Lấy ngày trong tuần dưới dạng văn bản
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
    return `${day}/${month}`;
}

// Chuyển đổi giờ thành định dạng "HH:MM"
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const BookingDetail = () => {
    const { movieId, orderId } = useParams();
    const [movie, setMovie] = useState([]);
    const [order, setOrder] = useState([]);
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        axios.get(`${jsonServer}/movies/${movieId}`).then(res => {
            setMovie(res.data);
        });
    }, [movieId]);

    useEffect(() => {
        axios.get(`${jsonServer}/orders/${orderId}`).then(res => {
            setOrder(res.data);
        });
    }, [orderId]);

    useEffect(() => {
        axios.get(`${jsonServer}/tickets?order_id=${orderId}`).then(res => {
            setTickets(res.data);
        });
    }, [orderId]);

    const orderDate = new Date(order.date_time);

    // Tạo chuỗi định dạng
    const formattedOrderDate =
        getDayOfWeek(orderDate) + ' ' + formatDate(orderDate);
    const formattedOrderTime = formatTime(orderDate);

    const totalPriceOrder = tickets.reduce((total, ticket) => {
        if (ticket.seat_type === 'normal') {
            return total + normalSeatsPrice;
        } else {
            return total + vipSeatsPrice;
        }
    }, 0);

    const ticketSeats = tickets.reduce((total, ticket) => {
        return total + ticket.seat_name + ' ';
    }, '');

    const handleFakePayment = () => {
        axios.patch(`${jsonServer}/orders/${orderId}`, { status: 'paid' });
    };

    const numberOfVipSeats = tickets.filter(
        ticket => ticket.seat_type === 'vip'
    ).length;
    const numberOfNormalSeats = tickets.filter(
        ticket => ticket.seat_type === 'normal'
    ).length;
    return (
        <>
            <Breadcrumb title={'Booking detail'} />
            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <h3>Schedule</h3>
                                <div className="anime__details__title">
                                    <span>Movie name</span>
                                    <h3>{movie.movie_name}</h3>
                                    <div
                                        className="product__sidebar__view__item set-bg mix day"
                                        data-setbg="img/sidebar/tv-5.jpg"
                                    >
                                        <img
                                            src={`${movie.banner_image_path}`}
                                        ></img>
                                    </div>
                                </div>
                                <div className="anime__details__title">
                                    <span>Day</span>
                                    <h3>{formattedOrderDate}</h3>
                                </div>
                                <div className="anime__details__title">
                                    <span>Time</span>
                                    <h3>{formattedOrderTime}</h3>
                                </div>
                                <div className="anime__details__title">
                                    <span>Seat</span>
                                    <h3>{ticketSeats}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login__register">
                                <h3>Your order</h3>
                                <div
                                    className="anime__details__title"
                                    style={{ borderBottom: 'solid 1px white' }}
                                >
                                    <span>Details:</span>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {numberOfNormalSeats !== 0 ? (
                                            <>
                                                <h3
                                                    style={{
                                                        color: 'white',
                                                    }}
                                                >
                                                    Normal seat
                                                </h3>
                                                <h3>
                                                    {`${normalSeatsPrice.toLocaleString(
                                                        'vi-VN',
                                                        {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }
                                                    )}`}{' '}
                                                    x {numberOfNormalSeats}
                                                </h3>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {numberOfVipSeats !== 0 ? (
                                            <>
                                                <h3
                                                    style={{
                                                        color: 'white',
                                                    }}
                                                >
                                                    VIP seat
                                                </h3>
                                                <h3>
                                                    {`${vipSeatsPrice.toLocaleString(
                                                        'vi-VN',
                                                        {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }
                                                    )}`}{' '}
                                                    x {numberOfVipSeats}
                                                </h3>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="anime__details__title"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: 'solid 1px white',
                                    }}
                                >
                                    <span>Total:</span>
                                    <h3>
                                        <h3>{`${totalPriceOrder.toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            }
                                        )}`}</h3>
                                    </h3>
                                </div>

                                <div className="anime__details__title">
                                    <h3>QR CODE IN HERE</h3>
                                    <Link
                                        to="/order"
                                        className="primary-btn"
                                        onClick={handleFakePayment}
                                    >
                                        FAKE PAYMENT
                                    </Link>
                                    <a
                                        href="login.html"
                                        className="primary-btn"
                                    >
                                        Bank
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BookingDetail;
