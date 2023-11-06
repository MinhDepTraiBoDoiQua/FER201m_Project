import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function OrderManage() {
    const [orders, setOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [movies, setMovies] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/orders').then(res => {
            let sortOrderByDate = res.data.sort((a, b) => {
                return new Date(b.date_time) - new Date(a.date_time);
            });
            setOrders(sortOrderByDate);
            setFilterOrders(sortOrderByDate);
            axios.get('http://localhost:3000/accounts').then(res => {
                setAccounts(res.data);
            });
            axios.get('http://localhost:3000/cinemas').then(res => {
                setCinemas(res.data);
            });
            axios.get('http://localhost:3000/theaters').then(res => {
                setTheaters(res.data);
            });
            axios.get('http://localhost:3000/movies').then(res => {
                setMovies(res.data);
            });
            axios.get('http://localhost:3000/users').then(res => {
                setUsers(res.data);
            });
            axios.get('http://localhost:3000/tickets').then(res => {
                setTickets(res.data);
                let t = 0;
                sortOrderByDate.map(order => {
                    t += res.data
                        .filter(ticket => ticket.order_id == order.id)
                        .reduce(
                            (total, value) =>
                                value.seat_type === 'normal' ? 70000 : 50000,
                            0
                        );
                });
                setTotal(t);
            });
        });
    }, []);

    const handleChangeMonth = e => {
        if (e.target.value == 0) {
            let t = 0;
            orders.map(order => {
                t += tickets
                    .filter(ticket => ticket.order_id == order.id)
                    .reduce(
                        (total, value) =>
                            value.seat_type === 'normal' ? 70000 : 50000,
                        0
                    );
            });
            setFilterOrders(orders);
            setTotal(t);
        } else {
            let filterOrder = orders.filter(
                order =>
                    new Date(order.date_time).getMonth() + 1 ==
                        e.target.value &&
                    new Date(order.date_time).getFullYear() ==
                        new Date().getFullYear()
            );
            setFilterOrders(filterOrder);
            let t = 0;
            filterOrder.map(order => {
                t += tickets
                    .filter(ticket => ticket.order_id == order.id)
                    .reduce(
                        (total, value) =>
                            value.seat_type === 'normal' ? 70000 : 50000,
                        0
                    );
            });
            setTotal(t);
        }
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Manage Order</h1>
            <p className="mb-4">Description</p>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6
                        className="m-0 font-weight-bold text-primary"
                        style={{ float: 'left' }}
                    >
                        Order
                    </h6>
                    <select name="month" onChange={handleChangeMonth}>
                        <option value={0} selected>
                            All
                        </option>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <h3>
                            TOTAL:{' '}
                            {total.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </h3>
                        <table
                            className="table table-bordered"
                            id="dataTable"
                            width="100%"
                            cellSpacing={0}
                        >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Movie Name</th>
                                    <th>Username</th>
                                    <th>Theater Name</th>
                                    <th>Date Time</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>
                                            {
                                                movies.find(
                                                    mov =>
                                                        mov.id == order.movie_id
                                                )?.movie_name
                                            }
                                        </td>
                                        <td>
                                            {
                                                accounts.find(
                                                    acc =>
                                                        order.user_id ==
                                                        users.find(
                                                            user =>
                                                                user.account_id ==
                                                                acc.id
                                                        )?.id
                                                )?.username
                                            }
                                        </td>
                                        <td>
                                            {
                                                theaters.find(
                                                    theater =>
                                                        order.theater_id ==
                                                        theater.id
                                                )?.theater_name
                                            }
                                        </td>
                                        <td>{order.date_time}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            {tickets
                                                .filter(
                                                    ticket =>
                                                        ticket.order_id ==
                                                        order.id
                                                )
                                                .reduce(
                                                    (total, value) =>
                                                        value.seat_type ===
                                                        'normal'
                                                            ? 70000
                                                            : 50000,
                                                    0
                                                )
                                                .toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
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
}
