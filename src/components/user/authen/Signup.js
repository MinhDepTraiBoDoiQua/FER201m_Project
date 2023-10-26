import { Link } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

const Signup = () => {
    return (
        <div>
            <Breadcrumb title={'Signup'} />

            {/* Signup section */}
            <section className="signup spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <h3>Sign Up</h3>
                                <form>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Email address"
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Password"
                                        />
                                        <span className="icon_lock"></span>
                                    </div>
                                    <button type="submit" class="site-btn">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login__register">
                                <h3>Have An Account?</h3>
                                <Link to="/login" class="primary-btn">
                                    Login Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Signup;
