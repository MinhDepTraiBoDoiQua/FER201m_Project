import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export default function Topbar() {
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <form className="form-inline">
                <button
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                >
                    <i className="fa fa-bars"></i>
                </button>
            </form>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">
                {/* Nav Item - Alerts */}
                <li className="nav-item dropdown no-arrow mx-1">
                    <Nav.Link
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="alertsDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="fas fa-bell fa-fw"></i>
                        <span className="badge badge-danger badge-counter">
                            2+
                        </span>
                    </Nav.Link>
                    {/* Dropdown - Alerts */}
                    <div
                        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="alertsDropdown"
                    >
                        <h6 className="dropdown-header">Alerts Center</h6>
                        <Link
                            to="/"
                            className="dropdown-item d-flex align-items-center"
                        >
                            <div className="mr-3">
                                <div className="icon-circle bg-primary">
                                    <i className="fas fa-file-alt text-white"></i>
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">
                                    December 12, 2019
                                </div>
                                <span className="font-weight-bold">
                                    A new monthly report is ready to download!
                                </span>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            className="dropdown-item text-center small text-gray-500"
                        >
                            Show All Alerts
                        </Link>
                    </div>
                </li>
                <div className="topbar-divider d-none d-sm-block"></div>

                {/* Nav Item - User Information */}
                <li className="nav-item dropdown no-arrow">
                    <Link
                        to="/"
                        className="nav-link dropdown-toggle"
                        id="userDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            Admin Name
                        </span>
                        <img
                            className="img-profile rounded-circle"
                            alt=""
                            src="https://herrmans.eu/wp-content/uploads/2019/01/765-default-avatar.png"
                        />
                    </Link>

                    {/* Dropdown - User Information */}
                    <div
                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown"
                    >
                        <Link to="/" className="dropdown-item">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link
                            to="/"
                            className="dropdown-item"
                            data-toggle="modal"
                            data-target="#logoutModal"
                        >
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
