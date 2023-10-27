import Sidebar from './components/admin/template/Sidebar';
import Topbar from './components/admin/template/Topbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
    MovieManage,
    MovieCreate,
    MovieEdit,
    MovieDelete,
} from './components/admin/Movie';
import {
    TheaterManage,
    TheaterCreate,
    TheaterEdit,
    TheaterDelete,
} from './components/admin/Theater';
import { CinemaManage, CinemaCreate } from './components/admin/Cinema';
import Footer from './components/admin/template/Footer';
import Welcome from './components/admin/template/Welcome';
import Login from './components/admin/authen/Login';
import UserContext from './components/admin/authen/UserContext';
import { useContext } from 'react';
import Logout from './components/admin/authen/Logout';
import Profile from './components/admin/profile/Profile';

function App() {
    const { isLoggedin } = useContext(UserContext);
    let checkLogin = false;
    if (!isLoggedin && sessionStorage.getItem('accountId') !== null) {
        checkLogin = true;
    } else {
        checkLogin = false;
    }
    // const isPathLogin = window.location.pathname === '/login';

    return (
        <div id="page-top">
            <BrowserRouter>
                <div id="wrapper">
                    {checkLogin && <Sidebar />}

                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            {checkLogin && <Topbar />}
                            <Routes>
                                {/* Authen */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                {/* Welcome */}
                                <Route path="/" element={<Welcome />} />

                                {/* Movie Manage */}
                                <Route
                                    path="/movie-manage"
                                    element={<MovieManage />}
                                />
                                <Route
                                    path="/movie-manage/create"
                                    element={<MovieCreate />}
                                />
                                <Route
                                    path="/movie-manage/edit/:id"
                                    element={<MovieEdit />}
                                />
                                <Route
                                    path="/movie-manage/delete/:id"
                                    element={<MovieDelete />}
                                />

                                {/* Theater Manage */}
                                <Route
                                    path="/theater-manage"
                                    element={<TheaterManage />}
                                />
                                <Route
                                    path="/theater-manage/create"
                                    element={<TheaterCreate />}
                                />
                                <Route
                                    path="/theater-manage/edit/:id"
                                    element={<TheaterEdit />}
                                />
                                <Route
                                    path="/theater-manage/delete/:id"
                                    element={<TheaterDelete />}
                                />

                                {/* Cinema Manage */}
                                <Route
                                    path="/cinema-manage"
                                    element={<CinemaManage />}
                                />
                                <Route
                                    path="/cinema-manage/create"
                                    element={<CinemaCreate />}
                                />

                                {/* Profile */}
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </div>
                        {checkLogin && <Footer />}
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
