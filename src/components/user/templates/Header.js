import { Link } from 'react-router-dom';

export default function Header({ account }) {
    return (
        <>
            {/* Page Preloder */}
            {/* <div id="preloder">
                <div className="loader"></div>
            </div> */}

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
                                        <li className="active">
                                            <Link to="/">Homepage</Link>
                                        </li>
                                        <li>
                                            <Link to="/">
                                                Categories{' '}
                                                <span className="arrow_carrot-down"></span>
                                            </Link>
                                            <ul className="dropdown">
                                                <li>
                                                    <Link to="/">
                                                        Categories
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/">
                                                        Anime Details
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/">
                                                        Anime Watching
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/">
                                                        Blog Details
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/">Sign Up</Link>
                                                </li>
                                                <li>
                                                    <Link to="/">Login</Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link to="/">Our Blog</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Contacts</Link>
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
