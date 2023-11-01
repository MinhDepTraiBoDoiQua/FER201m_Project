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
    const isLogin = sessionStorage.getItem('accountId') !== null;
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

    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
    const [isReportFormVisible, setIsReportFormVisible] = useState(false);
    const [isReportReplyFormVisible, setIsReportReplyFormVisible] =
        useState(false);

    const [replyFeedbackId, setReplyFeedbackId] = useState('');
    const [reportFeedbackId, setReportFeedbackId] = useState('');
    const [reportFeedbackReplyId, setReportFeedbackReplyId] = useState('');

    const showReplyForm = event => {
        setReplyFeedbackId(event.target.getAttribute('value'));
        setIsReplyFormVisible(true);
        setIsReportFormVisible(false);
        setIsReportReplyFormVisible(false);
    };

    const [reply, setReply] = useState('');
    const handleSubmitReplyFeedback = async e => {
        setDataLoaded(false);
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        const newFeedbackReply = {
            feedback_id: replyFeedbackId + '',
            user_id: users.find(user => user.account_id === accountId)?.id + '',
            reply: reply,
            date: dateTimeString,
            status: '1',
        };

        axios
            .post(`${jsonServer}/feedbacksReply`, newFeedbackReply)
            .then(res => {
                setIsReplyFormVisible(false);
                setChangeFeedbacks(!changeFeedbacks);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                setDataLoaded(true);
            });
    };

    const [report, setReport] = useState('');
    const showReportForm = event => {
        setReportFeedbackId(event.target.getAttribute('value'));
        setIsReportFormVisible(true);
        setIsReplyFormVisible(false);
        setIsReportReplyFormVisible(false);
    };

    const handleSubmitReportFeedback = async e => {
        setDataLoaded(false);
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        const newReport = {
            feedback_id: reportFeedbackId + '',
            user_id: users.find(user => user.account_id === accountId)?.id + '',
            report: report,
            date: dateTimeString,
        };

        axios
            .post(`${jsonServer}/reportFeedbacks`, newReport)
            .then(res => {
                setIsReportFormVisible(false);
                setChangeFeedbacks(!changeFeedbacks);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                setDataLoaded(true);
            });
    };

    const [reportReply, setReportReply] = useState('');
    const showReportReplyForm = event => {
        setReportFeedbackReplyId(event.target.getAttribute('value'));
        setIsReportReplyFormVisible(true);
        setIsReportFormVisible(false);
        setIsReplyFormVisible(false);
    };

    const handleSubmitReportReplyFeedback = async e => {
        setDataLoaded(false);
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        const newReport = {
            feedback_id: reportFeedbackReplyId + '',
            user_id: users.find(user => user.account_id === accountId)?.id + '',
            report: reportReply,
            date: dateTimeString,
        };

        axios
            .post(`${jsonServer}/reportReplyFeedbacks`, newReport)
            .then(res => {
                setIsReportReplyFormVisible(false);
                setChangeFeedbacks(!changeFeedbacks);
            })
            .catch(function (error) {
                console.log(error);
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
                {isLogin && (
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
                )}

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
                                    {isLogin && (
                                        <>
                                            <Link
                                                to="#"
                                                value={feedback.id}
                                                onClick={showReportForm}
                                            >
                                                Report
                                            </Link>
                                            <Link
                                                to="#"
                                                value={feedback.id}
                                                onClick={showReplyForm}
                                            >
                                                Reply
                                            </Link>
                                        </>
                                    )}
                                    {isReplyFormVisible &&
                                        replyFeedbackId == feedback.id &&
                                        isLogin && (
                                            <div className="anime__details__form ">
                                                <form
                                                    onSubmit={
                                                        handleSubmitReplyFeedback
                                                    }
                                                >
                                                    <textarea
                                                        placeholder="Your Reply"
                                                        onChange={e =>
                                                            setReply(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button type="submit">
                                                        <i className="fa fa-location-arrow"></i>{' '}
                                                        Give Reply
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    {isReportFormVisible &&
                                        reportFeedbackId == feedback.id &&
                                        isLogin && (
                                            <div className="anime__details__form ">
                                                <form
                                                    onSubmit={
                                                        handleSubmitReportFeedback
                                                    }
                                                >
                                                    <textarea
                                                        placeholder={`Report ${
                                                            accounts.find(
                                                                account =>
                                                                    account.id ===
                                                                        users.find(
                                                                            user =>
                                                                                user.id ===
                                                                                feedback.user_id
                                                                        )
                                                                            ?.account_id ??
                                                                    '0'
                                                            )?.username
                                                        }`}
                                                        onChange={e =>
                                                            setReport(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button type="submit">
                                                        <i className="fa fa-location-arrow"></i>{' '}
                                                        Report
                                                    </button>
                                                </form>
                                            </div>
                                        )}
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
                                                {isLogin && (
                                                    <>
                                                        <Link
                                                            to="#"
                                                            value={
                                                                feedbackReply.id
                                                            }
                                                            onClick={
                                                                showReportReplyForm
                                                            }
                                                        >
                                                            Report
                                                        </Link>
                                                    </>
                                                )}
                                                {isReportReplyFormVisible &&
                                                    reportFeedbackReplyId ==
                                                        feedbackReply.id &&
                                                    isLogin && (
                                                        <div className="anime__details__form ">
                                                            <form
                                                                onSubmit={
                                                                    handleSubmitReportReplyFeedback
                                                                }
                                                            >
                                                                <textarea
                                                                    placeholder={`Report ${
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
                                                                        )
                                                                            ?.username
                                                                    }`}
                                                                    onChange={e =>
                                                                        setReportReply(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <button type="submit">
                                                                    <i className="fa fa-location-arrow"></i>{' '}
                                                                    Report
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ))}
                {feedbacks.length === 0 && (
                    <h3 style={{ color: 'white' }}>No feedbacks</h3>
                )}
            </div>
        );
    }
}
