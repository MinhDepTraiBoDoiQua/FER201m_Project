import React, { useEffect, useState } from 'react';
import { jsonServer } from '../constant/Constant';

const GetAverageRating = ({ movieId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        fetch(jsonServer + '/feedbacks?movie_id=' + movieId)
            .then(res => res.json())
            .then(data => {
                setFeedbacks(data);
            });
    }, [movieId]);

    useEffect(() => {
        if (feedbacks.length > 0) {
            let sum = 0;
            feedbacks.forEach(feedback => {
                sum += Number(feedback.rating);
            });
            const avgRating = (sum / feedbacks.length).toFixed(1);
            setAverageRating(avgRating);
        } else {
            setAverageRating(null);
        }
    }, [feedbacks]);

    return (
        <div className="view">
            <i className="fa fa-star"></i>
            {averageRating !== null ? ` ${averageRating}` : ' No ratings yet'}
        </div>
    );
};

export { GetAverageRating };
