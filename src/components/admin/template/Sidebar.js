import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../authen/UserContext';
import { useState, useContext } from 'react';
import axios from 'axios';
import { jsonServer } from '../constant/Constant';

export default function Sidebar() {
    const { accountId } = useContext(UserContext);

    const [userType, setUserType] = useState('');

    useEffect(() => {
        axios
            .get(`${jsonServer}/accounts/${accountId}`)
            .then(function (response) {
                setUserType(response.data.user_type);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [accountId]);

    return (
        <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
        >
            <Link
                className="sidebar-brand d-flex align-items-center justify-content-center"
                to="/"
            >
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">
                    {userType === '1' ? 'ADMIN' : 'MANAGER'}
                    <sup>PRO</sup>
                </div>
            </Link>

            <hr className="sidebar-divider" />

            {userType === '2' ? (
                <li className="nav-item">
                    <Link to="/movie-manage" className="nav-link">
                        <i className="fas fa-fw fa-solid fa-film"></i>
                        <span> Movie</span>
                    </Link>
                </li>
            ) : (
                ''
            )}

            {userType === '1' ? (
                <>
                    <li as="li" className="nav-item">
                        <Link to="/ads-banner-manage" className="nav-link">
                            <img
                                src="admin/img/ads.svg"
                                alt="ads-banner"
                                width="20px"
                                height="20px"
                                style={{ marginRight: '5px' }}
                            ></img>
                            <span> Ad Banner</span>
                        </Link>
                    </li>
                    <li as="li" className="nav-item">
                        <Link to="/theater-manage" className="nav-link">
                            <i className="fas fa-fw fa-solid fa-dungeon"></i>
                            <span> Theater</span>
                        </Link>
                    </li>
                    <li as="li" className="nav-item">
                        <Link to="/cinema-manage" className="nav-link">
                            <i className="fas fa-fw fa-solid fa-tv"></i>
                            <span> Cinema</span>
                        </Link>
                    </li>
                    <li as="li" className="nav-item">
                        <Link to="/user-manage" className="nav-link">
                            <i className="fas fa-fw fa-solid fa-users"></i>
                            <span> User</span>
                        </Link>
                    </li>
                    <li as="li" className="nav-item">
                        <Link to="/order-manage" className="nav-link">
                            <i className="fas fa-fw fa-solid fa-tag"></i>
                            <span> Order</span>
                        </Link>
                    </li>
                    <li as="li" className="nav-item">
                        <Link to="/report-manage" className="nav-link">
                            <i className="fas fa-fw fa-tachometer-alt"></i>
                            <span> Report</span>
                        </Link>
                    </li>
                </>
            ) : (
                ''
            )}

            <hr className="sidebar-divider" />

            <li as="li" className="nav-item">
                <Link to="/profile" className="nav-link">
                    <i className="fas fa-user"></i>
                    <span> Profile</span>
                </Link>
            </li>
            <li as="li" className="nav-item">
                <Link to="/logout" className="nav-link">
                    <i className="fas fa-fw fas fa-sign-out-alt"></i>
                    <span> Logout</span>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <div className="text-center d-none d-md-inline">
                <button
                    className="rounded-circle border-0"
                    id="sidebarToggle"
                ></button>
            </div>
        </ul>
    );
}
