import React, { useEffect, useState } from 'react';
import UserContext from '../authen/UserContext';
import { useContext } from 'react';
import useScript from '../../../UseScript';
import Loading from '../template/Loading';
import { Link } from 'react-router-dom';
const UserList = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [accounts, setAccounts] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);


    useEffect(() => {
        fetch('http://localhost:3000/accounts')
            .then(res => res.json())
            .then(data => {
                const userAccounts = data.filter(account => account.user_type == 3)
                setAccounts(userAccounts);
                setDataLoaded(true);
            });
    }, []);

    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else {
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage User</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            User
                        </h6>
                        <Link to="/cinema-manage/create">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New User
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
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        accounts.map(ac => (
                                            <tr key={ac.id}>
                                                <td>{ac.username}</td>
                                                <td>
                                                    {ac.email}
                                                </td>
                                                <td>
                                                    {ac.status === '1'
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </td>
                                                <td>
                                                    {ac.status === '1'
                                                        ? 'Ban'
                                                        : 'Unban'}
                                                    {' '}
                                                    |{' '}
                                                    <Link
                                                        to={`/cinema-manage/details/${ac.id}`}
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};



export { UserList } 