import { Link } from 'react-router-dom';

export default function Breadcrumb({ currentPage }) {
    return (
        <div className="breadcrumb-option">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcrumb__links">
                            <Link to="/">
                                <i className="fa fa-home"></i> Home
                            </Link>
                            {/* <Link to="/">Movie Detail</Link> */}
                            <span>{currentPage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
