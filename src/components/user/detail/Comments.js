import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../templates/Loading';
import { jsonServer } from '../constant/Constant';

export default function Comments() {
    const { id } = useParams();

    const [dataLoaded, setDataLoaded] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    useEffect(() => {
        fetch(`${jsonServer}/feedbacks?movie_id=${id}`)
            .then(res => res.json())
            .then(data => {
                data.filter(dt => dt.status === '1');
                setFeedbacks(data);
                setDataLoaded(true);
            });
    }, [id]);

    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
            });
    }, []);

    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/accounts')
            .then(res => res.json())
            .then(data => {
                setAccounts(data);
            });
    }, []);

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="blog__details__comment">
                <div className="section-title">
                    <h5>Feedbacks</h5>
                </div>
                {feedbacks.map(feedback => (
                    <div
                        className="blog__details__comment__item"
                        key={feedback.id}
                    >
                        <div className="blog__details__comment__item__pic">
                            <img
                                src={`${
                                    accounts.find(
                                        account =>
                                            account.id ===
                                                users.find(
                                                    user =>
                                                        user.id ===
                                                        feedback.user_id
                                                )?.account_id ?? '0'
                                    )?.avatar_image_path
                                }`}
                                alt="user avatar"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>
                        <div className="blog__details__comment__item__text">
                            <span>{feedback.date}</span>
                            <h5>John Smith</h5>
                            <p>{feedback.comment}</p>
                            <Link to="#">Report</Link>
                            <Link to="#">Reply</Link>
                        </div>
                    </div>
                ))}
                <div className="blog__details__comment__item">
                    <div className="blog__details__comment__item__pic">
                        <img src="img/blog/details/comment-1.png" alt="" />
                    </div>
                    <div className="blog__details__comment__item__text">
                        <span>Sep 08, 2020</span>
                        <h5>John Smith</h5>
                        <p>
                            Neque porro quisquam est, qui dolorem ipsum quia
                            dolor sit amet, consectetur, adipisci velit, sed
                            quia non numquam eius modi
                        </p>
                        <Link to="#">Like</Link>
                        <Link to="#">Reply</Link>
                    </div>
                </div>
                <div className="blog__details__comment__item blog__details__comment__item--reply">
                    <div className="blog__details__comment__item__pic">
                        <img src="img/blog/details/comment-2.png" alt="" />
                    </div>
                    <div className="blog__details__comment__item__text">
                        <span>Sep 08, 2020</span>
                        <h5>Elizabeth Perry</h5>
                        <p>
                            Neque porro quisquam est, qui dolorem ipsum quia
                            dolor sit amet, consectetur, adipisci velit, sed
                            quia non numquam eius modi
                        </p>
                        <Link to="#">Like</Link>
                        <Link to="#">Reply</Link>
                    </div>
                </div>
                <div className="blog__details__comment__item">
                    <div className="blog__details__comment__item__pic">
                        <img src="img/blog/details/comment-3.png" alt="" />
                    </div>
                    <div className="blog__details__comment__item__text">
                        <span>Sep 08, 2020</span>
                        <h5>Adrian Coleman</h5>
                        <p>
                            Neque porro quisquam est, qui dolorem ipsum quia
                            dolor sit amet, consectetur, adipisci velit, sed
                            quia non numquam eius modi
                        </p>
                        <Link to="#">Like</Link>
                        <Link to="#">Reply</Link>
                    </div>
                </div>
                <div className="anime__details__form">
                    <div className="section-title">
                        <h5>Your Comment</h5>
                    </div>
                    <form action="#">
                        <textarea placeholder="Your Comment" />
                        <button type="submit">
                            <i className="fa fa-location-arrow"></i> Review
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
