import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export default function Sidebar() {
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
                    ADMIN<sup>PRO VIP</sup>
                </div>
            </Link>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <Link to="/movie-manage" className="nav-link">
                    <i className="fas fa-fw fa-solid fa-film"></i>
                    <span> Movie</span>
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

            <hr className="sidebar-divider" />

            <li as="li" className="nav-item">
                <Link to="/login" className="nav-link">
                    <i className="fas fa-fw fa-solid fa-user"></i>
                    <span> Login</span>
                </Link>
            </li>
            <li as="li" className="nav-item">
                <Nav.Link href="/logout" className="nav-link">
                    <i className="fas fa-fw fas fa-sign-out-alt"></i>
                    <span> Logout</span>
                </Nav.Link>
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
