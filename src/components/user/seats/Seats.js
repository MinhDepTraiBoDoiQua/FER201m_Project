import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    jsonServer,
    vipSeats,
    normalSeatsPrice,
    vipSeatsPrice,
} from '../constant/Constant';
import Loading from '../templates/Loading';
import { useNavigate } from 'react-router-dom';
import UserContext from '../authen/UserContext';

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

function getCurentDateTime() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function Seats() {
    const navigate = useNavigate();
    const { accountId } = useContext(UserContext);
    const [userId, setUserId] = useState('0');
    useEffect(() => {
        if (accountId === null || accountId === '0') {
            navigate('/login');
        } else {
            axios
                .get(`${jsonServer}/users?account_id=${accountId}`)
                .then(res => {
                    setUserId(res.data[0].id);
                });
        }
    }, [accountId, navigate]);
    const { movieId, showtimeId } = useParams();

    const [movie, setMovie] = useState([]);
    const [cinema, setCinema] = useState({});
    const [showtime, setShowtime] = useState({});
    const [theater, setTheater] = useState({});
    const [buyedSeats, setBuyedSeats] = useState([]); // Danh sách ghế đã được mua
    const [dataLoaded, setDataLoaded] = useState(false);
    const [tempSeats, setTempSeats] = useState(new Set()); // Danh sách ghế đã được chọn tạm thời

    useEffect(() => {
        setDataLoaded(false);
        axios.get(`${jsonServer}/movies/${movieId}`).then(res => {
            setMovie(res.data);
            setDataLoaded(true);
        });
    }, [movieId]);

    useEffect(() => {
        setDataLoaded(false);
        axios.get(`${jsonServer}/showtimes/${showtimeId}`).then(res => {
            setShowtime(res.data);
            const cinemaId = res.data.cinema_id;
            axios.get(`${jsonServer}/cinemas/${cinemaId}`).then(res => {
                setCinema(res.data);
                const theaterId = res.data.theater_id;
                axios.get(`${jsonServer}/theaters/${theaterId}`).then(res => {
                    setTheater(res.data);
                    setDataLoaded(true);
                });
            });
        });
    }, [showtimeId]);

    useEffect(() => {
        setDataLoaded(false);
        axios
            .get(`${jsonServer}/tickets?showtime_id=${showtimeId}`)
            .then(res => {
                const seatNames = res.data.map(ticket => ticket.seat_name);
                setBuyedSeats(seatNames);
                setDataLoaded(true);
            });
    }, []);

    // Xử lí in ra ngày giờ
    const startTime = new Date(showtime.start_time);
    const endTime = new Date(showtime.end_time);

    // Tạo chuỗi định dạng
    const formattedStartTime =
        getDayOfWeek(startTime) +
        ' ' +
        formatDate(startTime) +
        ' | ' +
        formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const formattedOutputDateTime =
        formattedStartTime + ' - ' + formattedEndTime;

    const fakeBuyedSeats = ['B7', 'C7', 'D6'];
    const [selectedSeats, setSelectedSeats] = useState([]);
    const totalAmount = selectedSeats.reduce((total, seat) => {
        if (vipSeats.includes(seat)) {
            return total + vipSeatsPrice;
        } else {
            return total + normalSeatsPrice;
        }
    }, 0);

    useEffect(() => {
        generateSeats();
    });

    function handleSeatClick(event, seatNumber) {
        const seat = event.target;
        if (selectedSeats.includes(seatNumber)) {
            // Nếu đã được chọn, hủy chọn ghế
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
            seat.style.backgroundColor =
                seat.id === 'vip' ? '#e53637' : 'rgba(255, 255, 255, 0.2)';
        } else if (buyedSeats.includes(seatNumber)) {
            // Ghế đã mua
            return;
        } else {
            // Nếu chưa được chọn, thêm vào danh sách
            setSelectedSeats([...selectedSeats, seatNumber]);
            seat.style.backgroundColor = '#323232';
        }
    }

    function generateSeats() {
        const totalRows = 5;
        const seatsPerRow = 20; // Số ghế mỗi hàng
        const seatsPerSide = seatsPerRow / 2; // Số ghế bên trái và bên phải

        let seatNumber = 1;
        let currentRow = 'A';

        const leftSeats = [];
        const rightSeats = [];

        for (let i = 1; i <= totalRows; i++) {
            for (let j = 1; j <= seatsPerRow; j++) {
                const seatNumberText = `${currentRow}${seatNumber}`;
                const isVIP =
                    (j >= 4 && j <= 7) || (j >= 14 && j <= 17)
                        ? currentRow !== 'A' && currentRow !== 'E'
                        : false;
                const isBuyed = buyedSeats.includes(seatNumberText);

                const seat = (
                    <a
                        key={seatNumberText}
                        id={isBuyed ? 'buyed' : isVIP ? 'vip' : ''}
                        onClick={event =>
                            handleSeatClick(event, seatNumberText)
                        }
                    >
                        {seatNumberText}
                    </a>
                );

                if (j <= seatsPerSide) {
                    leftSeats.push(seat);
                } else {
                    rightSeats.push(seat);
                }

                seatNumber++;

                if (seatNumber > seatsPerRow) {
                    seatNumber = 1;
                    currentRow = String.fromCharCode(
                        currentRow.charCodeAt(0) + 1
                    );
                }
            }
        }

        // Render the seats in React JSX
        return (
            <div className="cinema">
                <div className="screen">Screen</div>
                <div className="seats">
                    <div className="row">
                        <div className="col-6">
                            <div className="left-seats" id="leftSeats">
                                {leftSeats}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="right-seats" id="rightSeats">
                                {rightSeats}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // useEffect(() => {
    //     const updateTempSeats = async () => {
    //         for (const seat of selectedSeats) {
    //             if (!tempSeats.has(seat)) {
    //                 try {
    //                     const response = await axios.post(
    //                         `${jsonServer}/tempSeats`,
    //                         {
    //                             movie_id: movieId,
    //                             showtime_id: showtimeId,
    //                             seat_name: seat,
    //                         }
    //                     );
    //                     tempSeats.add(response.data.seat_name);
    //                     console.log(`Ghế ${seat} đã được thêm vào tempSeats.`);
    //                 } catch (error) {
    //                     console.error(
    //                         `Lỗi khi thêm ghế ${seat} vào tempSeats: ${error}`
    //                     );
    //                 }
    //             }
    //         }

    //         for (const seat of tempSeats) {
    //             if (!selectedSeats.includes(seat)) {
    //                 if (tempSeats.has(seat)) {
    //                     try {
    //                         await axios.delete(
    //                             `${jsonServer}/tempSeats?movie_id=${movieId}&showtime_id=${showtimeId}&seat_name=${seat}`
    //                         );
    //                         tempSeats.delete(seat);
    //                         console.log(
    //                             `Ghế ${seat} đã bị xóa khỏi tempSeats.`
    //                         );
    //                     } catch (error) {
    //                         console.error(
    //                             `Lỗi khi xóa ghế ${seat} khỏi tempSeats: ${error}`
    //                         );
    //                     }
    //                 } else {
    //                     console.log(
    //                         `Ghế ${seat} không tồn tại trong tempSeats.`
    //                     );
    //                 }
    //             }
    //         }
    //     };

    //     updateTempSeats();
    // }, [selectedSeats]);

    // const [tempSeatsChange, setTempSeatsChange] = useState(false);
    // const [allTempSeats, setAllTempSeats] = useState([]);
    // useEffect(() => {
    //     axios.get(`${jsonServer}/tempSeats`).then(res => {
    //         setAllTempSeats(res.data);
    //         setTempSeatsChange(!tempSeatsChange);
    //     })
    // },[tempSeatsChange]);

    // useEffect(() => {
    //     axios.get(`${jsonServer}/tempSeats`).then(res => {
    //         const tempSeats = new Set();
    //         res.data.forEach(tempSeat => {
    //             tempSeats.add(tempSeat.seat_name);
    //         });

    //     for (const seat of tempSeats) {
    //         buyedSeats.add(seat);
    //     }
    // }, [tempSeats]);

    const handleProcceedPayment = () => {
        axios
            .post(`${jsonServer}/orders`, {
                movie_id: movieId,
                theater_id: theater.id,
                date_time: getCurentDateTime(),
                user_id: userId,
                status: 'pending',
            })
            .then(res => {
                const orderId = res.data.id;
                const postRequests = selectedSeats.map(seat => {
                    return axios.post(`${jsonServer}/tickets`, {
                        order_id: orderId,
                        showtime_id: showtimeId,
                        seat_name: seat,
                        seat_type: vipSeats.includes(seat) ? 'vip' : 'normal',
                    });
                });

                // Use Promise.all to wait for all requests to complete
                Promise.all(postRequests)
                    .then(() => {
                        alert('Order successfully');
                        navigate(`/booking-detail/${movieId}/${orderId}`);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
    };

    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <section className="anime-details spad">
                <div className="container cinema-container">
                    <div className="cinema-container">{generateSeats()}</div>
                </div>
                <div className="container" style={{ width: '40%' }}>
                    <div className="seat-types">
                        <ul>
                            <div className="row">
                                <div className="col-lg-3">
                                    <li>
                                        <div
                                            id="normal"
                                            className="seat-type"
                                        ></div>
                                        <div className="seat-type-text">
                                            <p>Normal</p>
                                        </div>
                                    </li>
                                </div>
                                <div className="col-lg-3">
                                    <li>
                                        <div
                                            id="vip"
                                            className="seat-type"
                                        ></div>
                                        <div className="seat-type-text">
                                            <p>Vip</p>
                                        </div>
                                    </li>
                                </div>
                                <div className="col-lg-3">
                                    <li>
                                        <div
                                            id="chosing"
                                            className="seat-type"
                                        ></div>
                                        <div className="seat-type-text">
                                            <p>Chosing</p>
                                        </div>
                                    </li>
                                </div>
                                <div className="col-lg-3">
                                    <li>
                                        <div
                                            id="buyed"
                                            className="seat-type"
                                        ></div>
                                        <div className="seat-type-text">
                                            <p>Buyed</p>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="container" style={{ marginTop: '40px' }}>
                    <div className="row">
                        <div className="col-lg-4">
                            <div>
                                <div className="anime__details__title">
                                    <span>Movie:</span>
                                    <div>
                                        <h4 style={{ color: 'white' }}>
                                            {movie.movie_name}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div>
                                <div className="anime__details__title">
                                    <span>Date - time:</span>
                                    <div>
                                        <h4 style={{ color: 'white' }}>
                                            {formattedOutputDateTime}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div>
                                <div className="anime__details__title">
                                    <span>Theater:</span>
                                    <div>
                                        <h4 style={{ color: 'white' }}>
                                            {theater.theater_name}{' '}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ marginTop: '41px' }}>
                    <div className="row">
                        <div className="col-lg-3">
                            <div>
                                <div className="anime__details__title">
                                    <span>Seat:</span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <h4 style={{ color: 'white' }}>
                                            {selectedSeats.join(', ')}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div>
                                <div className="anime__details__title  total-price">
                                    <span>Total:</span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <h4
                                            style={{ color: 'white' }}
                                        >{`${totalAmount.toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            }
                                        )}`}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <div
                                className="anime__details__btn"
                                style={{ paddingTop: '15px' }}
                            >
                                <Link
                                    to="#"
                                    className="follow-btn"
                                    style={{
                                        width: '200px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {' '}
                                    Back
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div
                                className="anime__details__btn"
                                style={{ paddingTop: '15px' }}
                            >
                                <button
                                    type="submit"
                                    onClick={handleProcceedPayment}
                                    className="follow-btn"
                                >
                                    {' '}
                                    Proceed Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
}

export default Seats;
