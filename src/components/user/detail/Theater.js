import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loading from '../templates/Loading';

export default function Theater() {
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [theaterSelected, setTheaterSelected] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
                setDataLoaded(true);
            });
    }, []);

    const handleTheaterClick = event => {
        event.preventDefault();

        if (selectedTheater) {
            selectedTheater.style.backgroundColor = '';
        }

        setSelectedTheater(event.target);
        event.target.style.backgroundColor = '#e53637';
        const select = event.target.getAttribute('value');
        setTheaterSelected(select);
    };

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
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
        );
    }
}
