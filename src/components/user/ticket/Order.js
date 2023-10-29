import Breadcrumb from '../authen/Breadcrumb';
import Loading from '../templates/Loading';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../authen/UserContext';
import axios from 'axios';
import {
    jsonServer,
    normalSeatsPrice,
    vipSeatsPrice,
} from '../constant/Constant';
import { Link } from 'react-router-dom';

const Order = () => {
    const { accountId } = useContext(UserContext);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        if (accountId !== null && accountId !== '0') {
            axios
                .get(`${jsonServer}/users?account_id=${accountId}`)
                .then(function (response) {
                    setUserId(response.data[0].id);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [accountId]);

    const [orders, setOrders] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/orders?user_id=' + userId)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
            });
    }, [userId]);

    const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/movies')
            .then(res => res.json())
            .then(data => {
                setMovies(data);
            });
    }, []);

    const [theaters, setTheaters] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/theaters')
            .then(res => res.json())
            .then(data => {
                setTheaters(data);
            });
    }, []);
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        fetch(jsonServer + '/tickets?user_id=' + userId)
            .then(res => res.json())
            .then(data => {
                setTickets(data);
            });
    }, [userId]);

    return (
        <div>
            <Breadcrumb title={'My Ticket'} />
            <section className="blog spad">
                <div className="container">
                    <table className="table" style={{ color: 'white' }}>
                        <thead>
                            <tr>
                                <th scope="col">Movie name</th>
                                <th scope="col">Theater Name</th>
                                <th scope="col">Order Time</th>
                                <th scope="col">Total Price</th>
                                <th scope="col">View Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders
                                .sort(function (a, b) {
                                    const dateA = new Date(a.date_time);
                                    const dateB = new Date(b.date_time);

                                    return dateB - dateA;
                                })
                                .map((order, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            {
                                                movies.find(
                                                    movie =>
                                                        movie.id ===
                                                        order.movie_id
                                                ).movie_name
                                            }
                                        </th>
                                        <td>
                                            {
                                                theaters.find(
                                                    theater =>
                                                        theater.id ===
                                                        order.theater_id
                                                ).theater_name
                                            }
                                        </td>
                                        <td>{order.date_time}</td>
                                        <td>
                                            {tickets
                                                .reduce((total, ticket) => {
                                                    if (
                                                        ticket.order_id ===
                                                        order.id
                                                    ) {
                                                        const price =
                                                            ticket.seat_type ===
                                                            'vip'
                                                                ? vipSeatsPrice
                                                                : normalSeatsPrice;
                                                        return total + price;
                                                    } else {
                                                        return total;
                                                    }
                                                }, 0)
                                                .toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                        </td>
                                        <td>
                                            <Link to={`/order/${order.id}`}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                >
                                                    View Detail
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Order;
