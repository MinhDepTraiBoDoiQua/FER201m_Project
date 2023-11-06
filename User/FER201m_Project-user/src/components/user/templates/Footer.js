import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="page-up">
                    <Link to="#" id="scrollToTopButton">
                        <span className="arrow_carrot-up"></span>
                    </Link>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="footer__logo">
                                <a href="./index.html">
                                    <img src="img/logo.png" alt="" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="footer__nav">
                                <ul>
                                    <li className="active">
                                        <Link to="/">Homepage</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/order">My Order</Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="https://github.com/MinhDepTraiBoDoiQua/FER201m_Project"
                                            target="_blank"
                                        >
                                            Contacts
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <p>
                                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                Copyright &copy;
                                <script>
                                    document.write(new Date().getFullYear());
                                </script>
                                All rights reserved | This template is made with{' '}
                                <i
                                    className="fa fa-heart"
                                    aria-hidden="true"
                                ></i>{' '}
                                by{' '}
                                <Link to="https://colorlib.com" target="_blank">
                                    Colorlib
                                </Link>
                                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="./js/jquery-3.3.1.min.js"></script>
            <script src="./js/bootstrap.min.js"></script>
            <script src="./js/player.js"></script>
            <script src="./js/jquery.nice-select.min.js"></script>
            <script src="./js/mixitup.min.js"></script>
            <script src="./js/jquery.slicknav.js"></script>
            <script src="./js/owl.carousel.min.js"></script>
            <script src="./js/main.js"></script>
        </>
    );
}
