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
import Logout from './components/admin/authen/Logout';
import Profile from './components/admin/profile/Profile';
import ChangePassword from './components/admin/profile/ChangePassword';
import {
    AdsBannerCreate,
    AdsBannerDelete,
    AdsBannerEdit,
    AdsBannerManage,
} from './components/admin/adsBanner/AdsBanner';
import {
    MovieTimeCreate,
    MovieTimeDetail,
    MovieTimeManage,
} from './components/admin/movieTime/MovieTime';
import { UserList } from './components/admin/users/UserList';

function App() {
    let checkLogin = false;
    if (sessionStorage.getItem('accountId') !== null) {
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
                                <Route
                                    path="/profile/change-password"
                                    element={<ChangePassword />}
                                />

                                {/* UserList */}
                                <Route
                                    path="/user-manage"
                                    element={<UserList />}
                                />

                                {/* Ads Banner */}
                                <Route
                                    path="/ads-banner-manage"
                                    element={<AdsBannerManage />}
                                />
                                <Route
                                    path="/ads-banner-manage/create"
                                    element={<AdsBannerCreate />}
                                />
                                <Route
                                    path="/ads-banner-manage/edit/:id"
                                    element={<AdsBannerEdit />}
                                />
                                <Route
                                    path="/ads-banner-manage/delete/:id"
                                    element={<AdsBannerDelete />}
                                />

                                {/* Show times */}
                                <Route
                                    path="/show-times"
                                    element={<MovieTimeManage />}
                                />
                                <Route
                                    path="/show-times/detail/:id"
                                    element={<MovieTimeDetail />}
                                />
                                <Route
                                    path="/show-times/detail/:id/create"
                                    element={<MovieTimeCreate />}
                                />
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
