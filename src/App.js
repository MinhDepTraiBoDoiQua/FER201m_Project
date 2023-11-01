import Footer from './components/user/templates/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/user/home/Home';
import MovieDetails from './components/user/detail/MovieDetails';
import Login from './components/user/authen/Login';
import Signup from './components/user/authen/Signup';
import { Profile, ProfileEdit } from './components/user/profile/Profile';
import Logout from './components/user/authen/Logout';
import Header from './components/user/templates/Header';
import axios from 'axios';
import UserContext from './components/user/authen/UserContext';
import { useContext, useEffect, useState } from 'react';
import { jsonServer } from './components/user/constant/Constant';
import { ChangePassword } from './components/user/profile/ChangePassword';
import Seats from './components/user/seats/Seats';
import BookingDetail from './components/user/booking/BookingDetail';
import { MyTicket } from './components/user/ticket/MyTicket';
import Order from './components/user/ticket/Order';
// import Demo from './components/user/demoSocket/Demo';

function App() {
    const { accountId } = useContext(UserContext);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        if (accountId !== null && accountId !== '0') {
            axios
                .get(`${jsonServer}/accounts/${accountId}`)
                .then(function (response) {
                    setAccount(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [accountId]);
    return (
        <>
            <BrowserRouter>
                <Header account={account} />
                <Routes>
                    <Route path="/" element={<Home />}></Route>

                    {/* Authen Section */}
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/logout" element={<Logout />}></Route>

                    {/* Profile Section */}
                    <Route
                        path="/profile"
                        element={<Profile account={account} />}
                    ></Route>
                    <Route
                        path="/profile/edit"
                        element={<ProfileEdit account={account} />}
                    ></Route>
                    <Route
                        path="/profile/change-password"
                        element={<ChangePassword account={account} />}
                    ></Route>

                    {/* Movie Section */}
                    <Route
                        path="/movie-detail/:id"
                        element={<MovieDetails />}
                    ></Route>
                    <Route path="/seats" element={<Seats />}></Route>
                    <Route
                        path="/choosing-seat/:movieId/:showtimeId"
                        element={<Seats />}
                    />
                    <Route
                        path="/booking-detail/:movieId/:orderId"
                        element={<BookingDetail />}
                    />

                    {/* Order Section */}
                    <Route path="/order" element={<Order />}></Route>
                    <Route
                        path="/order/:orderId"
                        element={<MyTicket />}
                    ></Route>

                    {/* Demo Section */}
                    {/* <Route path="/demo-socket" element={<Demo />}></Route> */}
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
