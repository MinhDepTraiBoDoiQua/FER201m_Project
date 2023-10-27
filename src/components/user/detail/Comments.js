import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Loading from '../templates/Loading';
import { jsonServer } from '../constant/Constant';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import UserContext from '../authen/UserContext';

export default function Comments() {
    const { id } = useParams();

    const [dataLoaded, setDataLoaded] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [changeFeedbacks, setChangeFeedbacks] = useState(false);
    useEffect(() => {
        fetch(`${jsonServer}/feedbacks?movie_id=${id}`)
            .then(res => res.json())
            .then(data => {
                data.filter(dt => dt.status === '1');
                setFeedbacks(data);
                setDataLoaded(true);
            });
    }, [id, changeFeedbacks]);

    const [feedbacksReply, setFeedbacksReply] = useState([]);
    useEffect(() => {
        axios
            .get(`${jsonServer}/feedbacksReply`)
            .then(res => {
                setFeedbacksReply(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [changeFeedbacks]);

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

    const [star, setStar] = useState(0);
    const [comment, setComment] = useState('');
    const { accountId } = useContext(UserContext);
    const handleSubmitFeedback = async e => {
        e.preventDefault();
        setDataLoaded(false);
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        const newFeedback = {
            movie_id: id + '',
            user_id: users.find(user => user.account_id === accountId)?.id + '',
            rating: star + '',
            comment: comment,
            date: dateTimeString,
            status: '1',
        };

        axios
            .post(`${jsonServer}/feedbacks`, newFeedback)
            .then(res => {
                setChangeFeedbacks(!changeFeedbacks);
            })
            .catch(function (error) {
                console.log(error);
                setDataLoaded(true);
            })
            .finally(() => {
                setDataLoaded(true);
            });
    };

    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="blog__details__comment">
                <div className="anime__details__form">
                    <div className="section-title">
                        <h5>Your Feedback</h5>
                    </div>
                    <form onSubmit={handleSubmitFeedback}>
                        <ReactStars
                            count={5}
                            size={24}
                            a11y={true}
                            isHalf={false}
                            value={0}
                            filledIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                            color="white"
                            onChange={startValue => {
                                setStar(startValue);
                            }}
                        />
                        <textarea
                            placeholder="Your Comment"
                            onChange={e => setComment(e.target.value)}
                        />
                        <button type="submit">
                            <i className="fa fa-location-arrow"></i> Give
                            Feedback
                        </button>
                    </form>
                </div>
                <br />
                <div className="section-title">
                    <h5>Feedbacks</h5>
                </div>

                {feedbacks
                    .sort(function (a, b) {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        return dateB - dateA;
                    })
                    .map(feedback => (
                        <div key={`feedback-${feedback.id}`}>
                            <div className="blog__details__comment__item">
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
                                    <h5>
                                        {
                                            accounts.find(
                                                account =>
                                                    account.id ===
                                                        users.find(
                                                            user =>
                                                                user.id ===
                                                                feedback.user_id
                                                        )?.account_id ?? '0'
                                            )?.username
                                        }
                                    </h5>
                                    <span>
                                        {Array(Number(feedback.rating))
                                            .fill()
                                            .map((_, index) => (
                                                <i
                                                    key={index}
                                                    className="fa fa-star"
                                                    style={{ color: '#f1c40f' }}
                                                ></i>
                                            ))}{' '}
                                        &nbsp;&nbsp; | &nbsp;&nbsp;
                                        {feedback.date}
                                    </span>
                                    <p>{feedback.comment}</p>
                                    <Link to="#">Report</Link>
                                    <Link to="#">Reply</Link>
                                </div>
                            </div>

                            {feedbacksReply.map(feedbackReply => {
                                if (feedbackReply.feedback_id === feedback.id) {
                                    return (
                                        <div
                                            className="blog__details__comment__item blog__details__comment__item--reply"
                                            key={feedbackReply.id}
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
                                                                            feedbackReply.user_id
                                                                    )
                                                                        ?.account_id ??
                                                                '0'
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
                                                <span>
                                                    {feedbackReply.date}
                                                </span>
                                                <h5>
                                                    {
                                                        accounts.find(
                                                            account =>
                                                                account.id ===
                                                                    users.find(
                                                                        user =>
                                                                            user.id ===
                                                                            feedbackReply.user_id
                                                                    )
                                                                        ?.account_id ??
                                                                '0'
                                                        )?.username
                                                    }
                                                </h5>
                                                <p>{feedbackReply.reply}</p>
                                                <Link to="#">Report</Link>
                                                <Link to="#">Reply</Link>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ))}
            </div>
        );
    }
}
