import { Col, Container, Row } from 'react-bootstrap';
import Breadcrumb from './Breadcrumb';
import Details from './Details';
import TopView from '../home/TopView';
import Comments from './Comments';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { weekday, jsonServer } from '../constant/Constant';

export default function MovieDetails() {
    const { id } = useParams();
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [theaterSelected, setTheaterSelected] = useState(null);
    const [datesSelected, setDatesSelected] = useState(null);

    useEffect(() => {
        fetch(jsonServer + '/theaters')
            .then(res => res.json())
            .then(data => {
                data.filter(dt => dt.status === '1');
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    const [dataLoadTheaterClicked, setDataLoadTheaterClicked] = useState(false);
    const handleTheaterClick = event => {
        event.preventDefault();
        setDataLoadTheaterClicked(false);

        if (selectedTheater) {
            selectedTheater.style.backgroundColor = '';
        }

        setSelectedTheater(event.target);
        event.target.style.backgroundColor = '#e53637';
        const select = event.target.getAttribute('value');
        setTheaterSelected(select);
        setDataLoadTheaterClicked(true);
    };

    const [movie, setMovie] = useState([]);
    const [datesSelect, setDateSelect] = useState([]);

    useEffect(() => {
        fetch(jsonServer + '/movies/' + id)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setDataLoaded(true);
            });

        if (dataLoaded) {
            let dates = [];
            const startDate = new Date(movie.start_date);
            const endDate = new Date(movie.end_date);

            while (startDate <= endDate) {
                dates.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 1);
            }
            setDateSelect(dates);
        }
    }, [id, dataLoaded, movie.start_date, movie.end_date]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [dataLoadDateClicked, setDataLoadDateClicked] = useState(false);
    const handleDateClick = event => {
        event.preventDefault();
        setDataLoadDateClicked(false);
        if (selectedDate) {
            selectedDate.style.backgroundColor = '';
        }

        setSelectedDate(event.target);
        event.target.style.backgroundColor = '#e53637';

        const selectDate = event.target.getAttribute('value');
        setDataLoadDateClicked(true);
        setDatesSelected(selectDate);
    };

    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSelected, setTimeSelected] = useState('');
    const handleTimeClick = event => {
        event.preventDefault();

        const selectTime = event.target.getAttribute('value');
        setTimeSelected(selectTime);
        if (selectedTime) {
            selectedTime.style.backgroundColor = '';
        }

        setSelectedTime(event.target);
        event.target.style.backgroundColor = '#e53637';
    };
    // console.log('Set value', timeSelected);

    const [timesSelect, setTimesSelect] = useState([]);

    useEffect(() => {
        if (
            dataLoadDateClicked &&
            dataLoadTheaterClicked &&
            datesSelected &&
            theaterSelected
        ) {
            let cinemas = [];
            fetch(jsonServer + '/cinemas?theater_id=' + theaterSelected)
                .then(res => res.json())
                .then(data => {
                    data.forEach(dt => {
                        cinemas.push(dt.id);
                    });
                    fetch(jsonServer + '/showtimes?movie_id=' + id)
                        .then(res => res.json())
                        .then(data => {
                            setTimesSelect(
                                data.filter(
                                    time =>
                                        time.start_time.split(' ')[0].trim() ===
                                            datesSelected.trim() &&
                                        cinemas.includes(time.cinema_id)
                                )
                            );
                        });
                });
        }
    }, [
        dataLoadDateClicked,
        dataLoadTheaterClicked,
        id,
        timesSelect,
        datesSelected,
        theaterSelected,
    ]);

    return (
        <>
            <Breadcrumb currentPage="Movie Detail" />
            <section className="anime-details spad">
                <Container>
                    <Details timeSelected={timeSelected} />
                    <Row>
                        <Col lg={8} md={8}>
                            {/* Select theater */}
                            <div className="anime__details__review">
                                <div className="section-title">
                                    <h5>Theater</h5>
                                </div>
                                <div className="anime__details__episodes">
                                    {theaters.map(theater => (
                                        <Link
                                            as="a"
                                            className="episode "
                                            onClick={handleTheaterClick}
                                            value={theater.id}
                                            key={theater.id}
                                        >
                                            {theater.theater_name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Select date */}
                            <div className="anime__details__review">
                                <div className="section-title">
                                    <h5>Date</h5>
                                </div>
                                <div className="anime__details__episodes">
                                    {datesSelect.map((date, index) => (
                                        <Link
                                            as="a"
                                            className="item"
                                            style={{ textAlign: 'center' }}
                                            key={index}
                                            onClick={handleDateClick}
                                            value={
                                                date.getYear() +
                                                1900 +
                                                '-' +
                                                (date.getMonth() + 1) +
                                                '-' +
                                                date.getDate()
                                            }
                                        >
                                            {weekday[date.getDay()] +
                                                ' ' +
                                                date.getDate() +
                                                '/' +
                                                (date.getMonth() + 1)}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Select time */}
                            <div className="anime__details__review">
                                <div className="section-title">
                                    <h5>Time</h5>
                                </div>
                                <div className="anime__details__episodes">
                                    {timesSelect.map(time => (
                                        <Link
                                            as="a"
                                            className="item"
                                            style={{ textAlign: 'center' }}
                                            key={time.id}
                                            onClick={handleTimeClick}
                                            value={time.id}
                                        >
                                            {time.start_time.split(' ')[1]}
                                        </Link>
                                    ))}
                                    {timesSelect.length === 0 ? (
                                        <h3 style={{ color: 'white' }}>
                                            There are currently no showtimes
                                        </h3>
                                    ) : null}
                                </div>
                            </div>
                            <Comments />
                        </Col>
                        <Col>
                            <TopView />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}
