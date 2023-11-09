import UserContext from '../authen/UserContext';
import React, { useEffect, useState, useContext } from 'react';
import Loading from '../template/Loading';
import useScript from '../../../UseScript';
import { jsonServer } from '../constant/Constant';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FeedbackManage = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [movies, setMovies] = useState([]);
    const [reportFeedbacks, setReportFeedbacks] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/feedbacks')
            .then(res => res.json())
            .then(data => {
                setFeedbacks(data);
                fetch(jsonServer + '/users')
                    .then(res => res.json())
                    .then(data => {
                        setUsers(data);
                        fetch(jsonServer + '/movies')
                            .then(res => res.json())
                            .then(data => {
                                setMovies(data);
                                fetch(jsonServer + '/accounts')
                                    .then(res => res.json())
                                    .then(data => {
                                        setAccounts(data);
                                        fetch(jsonServer + '/reportFeedbacks')
                                            .then(res => res.json())
                                            .then(data => {
                                                setReportFeedbacks(data);
                                                setDataLoaded(true);
                                            });
                                    });
                            });
                    });
            });
    }, [status]);

    const handleChangeStatus = e => {
        const id = e.target.value;
        const feedback = feedbacks.find(feedback => feedback.id === id);
        feedback.status = !feedback.status;
        fetch(jsonServer + '/feedbacks/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedback),
        })
            .then(res => res.json())
            .then(data => {
                const newFeedbacks = feedbacks.map(feedback => {
                    if (feedback.id === id) {
                        return data;
                    }
                    return feedback;
                });
                setFeedbacks(newFeedbacks);
                setStatus(!status);
            });
    };

    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage Feedback</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Feedback List
                        </h6>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Movie name</th>
                                        <th>Date</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Total Report</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map(feedback => (
                                        <tr key={feedback.id}>
                                            <td>
                                                {
                                                    accounts.find(
                                                        account =>
                                                            account.id ===
                                                                users.find(
                                                                    user =>
                                                                        user.id ===
                                                                        feedback.user_id
                                                                )?.account_id ??
                                                            '0'
                                                    )?.username
                                                }
                                            </td>
                                            <td>
                                                {
                                                    movies.find(
                                                        movie =>
                                                            movie.id ===
                                                            feedback.movie_id
                                                    ).movie_name
                                                }
                                            </td>
                                            <td>{feedback.date}</td>
                                            <td>{feedback.rating}</td>
                                            <td>{feedback.comment}</td>
                                            <td>
                                                {
                                                    reportFeedbacks.filter(
                                                        reportFeedback =>
                                                            reportFeedback.feedback_id ===
                                                            feedback.id
                                                    ).length
                                                }
                                            </td>
                                            <td>
                                                {feedback.status ? (
                                                    <Button
                                                        variant="success"
                                                        value={feedback.id}
                                                        onClick={
                                                            handleChangeStatus
                                                        }
                                                    >
                                                        Normal
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="danger"
                                                        value={feedback.id}
                                                        onClick={
                                                            handleChangeStatus
                                                        }
                                                    >
                                                        Banned
                                                    </Button>
                                                )}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/feedback-manage/show-report/${feedback.id}`}
                                                >
                                                    Show Report
                                                </Link>{' '}
                                                |{' '}
                                                <Link
                                                    to={`/feedback-manage/detail/${feedback.id}`}
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
};

const ReportFeedbackManage = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const { id } = useParams();

    const [reportFeedbacks, setReportFeedbacks] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [feedback, setFeedback] = useState([]);
    useEffect(() => {
        axios
            .get(jsonServer + '/reportFeedbacks?feedback_id=' + id)
            .then(res => {
                const feedbackId = res.data.feedback_id;
                setReportFeedbacks(res.data);
                axios.get(jsonServer + '/users').then(res => {
                    setUsers(res.data);
                    axios.get(jsonServer + '/accounts').then(res => {
                        setAccounts(res.data);
                        axios.get(jsonServer + '/users').then(res => {
                            setUsers(res.data);
                            axios
                                .get(jsonServer + '/feedbacks/' + id)
                                .then(res => {
                                    setFeedback(res.data);
                                    setDataLoaded(true);
                                });
                        });
                    });
                });
            });
    }, [id]);

    // useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">
                    All reports to user{' '}
                    {
                        accounts.find(
                            acc =>
                                acc.id ===
                                users.find(user => user.id === feedback.user_id)
                                    .account_id
                        ).username
                    }{' '}
                    with comment : {feedback.comment}
                </h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Report List
                        </h6>
                        <Link to="/feedback-manage">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Back To Feeback Manage
                            </button>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Report</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportFeedbacks.map(report => (
                                        <tr key={report.id}>
                                            <td>
                                                {
                                                    accounts.find(
                                                        account =>
                                                            account.id ===
                                                                users.find(
                                                                    user =>
                                                                        user.id ===
                                                                        report.user_id
                                                                )?.account_id ??
                                                            '0'
                                                    )?.username
                                                }
                                            </td>
                                            <td>{report.report}</td>
                                            <td>{report.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
};

const FeedbackReply = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const { id } = useParams();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [feedbacksReply, setFeedbacksReply] = useState([]);
    const [reportReplyFeedbacks, setReportReplyFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        axios
            .get(jsonServer + '/feedbacksReply?feedback_id=' + id)
            .then(res => {
                setFeedbacksReply(res.data);
                axios.get(jsonServer + '/reportReplyFeedbacks').then(res => {
                    setReportReplyFeedbacks(res.data);
                    axios.get(jsonServer + '/users').then(res => {
                        setUsers(res.data);
                        axios.get(jsonServer + '/accounts').then(res => {
                            setAccounts(res.data);
                            axios
                                .get(jsonServer + '/feedbacks/' + id)
                                .then(res => {
                                    setFeedback(res.data);
                                    setDataLoaded(true);
                                });
                        });
                    });
                });
            });
    }, [id, status]);

    const handleChangeStatus = e => {
        const id = e.target.value;
        const feedbackReply = feedbacksReply.find(
            feedbackReply => feedbackReply.id === id
        );
        feedbackReply.status = !feedbackReply.status;
        fetch(jsonServer + '/feedbacksReply/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackReply),
        })
            .then(res => res.json())
            .then(data => {
                const newFeedbacksReply = feedbacksReply.map(feedbackReply => {
                    if (feedbackReply.id === id) {
                        return data;
                    }
                    return feedbackReply;
                });
                setFeedbacksReply(newFeedbacksReply);
                setStatus(!status);
            });
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">
                All reply feedbacks to user{' '}
                {
                    accounts.find(
                        acc =>
                            acc.id ===
                            users.find(user => user.id === feedback.user_id)
                                ?.account_id
                    )?.username
                }{' '}
                with comment : {feedback.comment}
            </h1>
            <p className="mb-4">Description</p>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6
                        className="m-0 font-weight-bold text-primary"
                        style={{ float: 'left' }}
                    >
                        Feedback Reply List
                    </h6>
                    <Link to="/feedback-manage">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            style={{ float: 'right' }}
                        >
                            Back To Feeback Manage
                        </button>
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table
                            className="table table-bordered"
                            id="dataTable"
                            width="100%"
                            cellSpacing={0}
                        >
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Date</th>
                                    <th>Reply</th>
                                    <th>Total Report</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacksReply.map(feedbackReply => (
                                    <tr key={feedbackReply.id}>
                                        <td>
                                            {
                                                accounts.find(
                                                    account =>
                                                        account.id ===
                                                            users.find(
                                                                user =>
                                                                    user.id ===
                                                                    feedbackReply.user_id
                                                            )?.account_id ?? '0'
                                                )?.username
                                            }
                                        </td>
                                        <td>{feedbackReply.date}</td>
                                        <td>{feedbackReply.reply}</td>
                                        <td>
                                            {
                                                reportReplyFeedbacks.filter(
                                                    reportReplyFeedback =>
                                                        reportReplyFeedback.feedback_id ===
                                                        feedbackReply.id
                                                ).length
                                            }
                                        </td>
                                        <td>
                                            {feedbackReply.status ? (
                                                <Button
                                                    variant="success"
                                                    value={feedbackReply.id}
                                                    onClick={handleChangeStatus}
                                                >
                                                    Normal
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="danger"
                                                    value={feedbackReply.id}
                                                    onClick={handleChangeStatus}
                                                >
                                                    Banned
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/feedback-manage/detail/show-report/${feedbackReply.id}`}
                                            >
                                                Show Report
                                            </Link>{' '}
                                            |{' '}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeedbackReplyReport = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const { id } = useParams();

    const [reportReplyFeedbacks, setReportReplyFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [feedbackReply, setFeedbackReply] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        axios
            .get(jsonServer + '/reportReplyFeedbacks?feedback_id=' + id)
            .then(res => {
                setReportReplyFeedbacks(res.data);
                axios.get(jsonServer + '/users').then(res => {
                    setUsers(res.data);
                    axios.get(jsonServer + '/accounts').then(res => {
                        setAccounts(res.data);
                        axios
                            .get(jsonServer + '/feedbacksReply/' + id)
                            .then(res => {
                                setFeedbackReply(res.data);
                                setDataLoaded(true);
                            });
                    });
                });
            });
    }, [id]);

    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">
                    All reports to user{' '}
                    {
                        accounts.find(
                            acc =>
                                acc.id ===
                                users.find(
                                    user => user.id === feedbackReply.user_id
                                ).account_id
                        ).username
                    }{' '}
                    with reply : {feedbackReply.reply}
                </h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Report List
                        </h6>
                        <Link to="/feedback-manage">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Back To Feeback Manage
                            </button>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Report</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportReplyFeedbacks.map(report => (
                                        <tr key={report.id}>
                                            <td>
                                                {
                                                    accounts.find(
                                                        account =>
                                                            account.id ===
                                                                users.find(
                                                                    user =>
                                                                        user.id ===
                                                                        report.user_id
                                                                )?.account_id ??
                                                            '0'
                                                    )?.username
                                                }
                                            </td>
                                            <td>{report.report}</td>
                                            <td>{report.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export {
    FeedbackManage,
    ReportFeedbackManage,
    FeedbackReply,
    FeedbackReplyReport,
};
