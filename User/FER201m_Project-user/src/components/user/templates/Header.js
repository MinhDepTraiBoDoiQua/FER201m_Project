import { Link, useLocation } from 'react-router-dom';

export default function Header({ account }) {
    const location = useLocation();

    // Access the current URL or route
    const currentURL = location.pathname;
    return (
        <>
            {/* Header Section Begin */}
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2">
                            <div
                                style={{
                                    padding: '5px 0 5px',
                                    textAlign: 'left',
                                }}
                            >
                                <Link to="/">
                                    <img
                                        src="img/logo.png"
                                        alt=""
                                        style={{ width: '50px' }}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="header__nav">
                                <nav className="header__menu mobile-menu">
                                    <ul>
                                        <li
                                            className={`${
                                                currentURL === '/'
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <Link to="/">Homepage</Link>
                                        </li>
                                        <li
                                            className={`${
                                                currentURL.includes('/profile')
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <Link to="/profile">Profile</Link>
                                        </li>
                                        <li
                                            className={`${
                                                currentURL.includes('/order')
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <Link to="/order">My Order</Link>
                                        </li>
                                        <li
                                            className={`${
                                                currentURL === '/contact'
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <Link
                                                to="https://github.com/MinhDepTraiBoDoiQua/FER201m_Project"
                                                target="_blank"
                                            >
                                                Contacts
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            {account ? (
                                <div
                                    style={{
                                        padding: '10px 0 10px',
                                        textAlign: 'right',
                                    }}
                                >
                                    <Link to="/profile">
                                        <img
                                            src={`${account?.avatar_image_path}`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                            }}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            ) : (
                                <div className="header__right">
                                    <Link to="/login">
                                        <span className="icon_profile"></span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="mobile-menu-wrap"></div>
                </div>
            </header>
            {/* Header End */}
        </>
    );
}
