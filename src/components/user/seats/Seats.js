import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Seats() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const totalAmount = selectedSeats.length * 170; // Giá của mỗi ghế là 170000 VND

    useEffect(() => {
        generateSeats();
    });

    function handleSeatClick(event, seatNumber) {
        const seat = event.target
        if (selectedSeats.includes(seatNumber)) {
            // Nếu đã được chọn, hủy chọn ghế
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
            seat.style.backgroundColor = seat.id === 'vip' ? '#e53637' : 'rgba(255, 255, 255, 0.2)';
        } else {
            if (seatNumber.startsWith('B') && seatNumber.slice(1) >= 1 && seatNumber.slice(1) <= 3) {
                // Ghế đã mua
                return;
            }
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
                    (j >= 4 && j <= 7) || (j >= 14 && j <= 17) ? (currentRow !== 'A' && currentRow !== 'E') : false;
                const isBuyed = j >= 1 && j <= 3 && currentRow === 'B';

                const seat = (
                    <a
                        key={seatNumberText}
                        id={isVIP ? 'vip' : isBuyed ? 'buyed' : ''}
                        onClick={(event) => handleSeatClick(event, seatNumberText)}
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
                    currentRow = String.fromCharCode(currentRow.charCodeAt(0) + 1);
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
                                    <div id="normal" className="seat-type">
                                    </div>
                                    <div className="seat-type-text">
                                        <p>Normal</p>
                                    </div>
                                </li>
                            </div>
                            <div className="col-lg-3">
                                <li>
                                    <div id="vip" className="seat-type"></div>
                                    <div className="seat-type-text">
                                        <p>Vip</p>
                                    </div>
                                </li>
                            </div>
                            <div className="col-lg-3">
                                <li>
                                    <div id="chosing" className="seat-type"></div>
                                    <div className="seat-type-text">
                                        <p>Chosing</p>
                                    </div>
                                </li>
                            </div>
                            <div className="col-lg-3">
                                <li>
                                    <div id="buyed" className="seat-type"></div>
                                    <div className="seat-type-text">
                                        <p>Buyed</p>
                                    </div>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
            <div className="container" style={{marginTop: '40px'}}>
            <div className="row">
                <div className="col-lg-4">
                    <div>
                        <div className="anime__details__title">
                            <span>Movie:</span>
                            <div>
                                <h4 style={{color: 'white'}}>Ki si bong dem</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div>
                        <div className="anime__details__title">
                            <span>Date - time:</span>
                            <div>
                                <h4 style={{color: 'white'}}>Saturday 28/10 | 20:00 - 22:00</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div>
                        <div className="anime__details__title">
                            <span>Theater:</span>
                            <div>
                                <h4 style={{color: 'white'}}>CGV Vinh Center </h4>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ color: 'white' }}>{selectedSeats.join(', ')}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div>
                            <div className="anime__details__title  total-price">
                                <span>Total:</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ color: 'white' }}>{`${totalAmount}.000 VND`}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="anime__details__btn" style={{ paddingTop: '15px' }}>
                            <Link to="#" className="follow-btn" style={{ width: '200px', textAlign: 'center' }}> Back</Link>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="anime__details__btn" style={{ paddingTop: '15px' }}>
                            <Link to='' className="follow-btn"> Proceed Payment</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Seats;
