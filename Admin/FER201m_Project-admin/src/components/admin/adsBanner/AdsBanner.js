import UserContext from '../authen/UserContext';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../template/Loading';
import useScript from '../../../UseScript';
import { jsonServer } from '../constant/Constant';
import { v4 } from 'uuid';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { storage } from '../../../firebaseImage/Config';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdsBannerManage = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const [adsBannerList, setAdsBannerList] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + '/adsBanner')
            .then(res => res.json())
            .then(data => {
                setAdsBannerList(data);
                setDataLoaded(true);
            });
    }, []);
    useScript(dataLoaded, 'admin/js/demo/datatables-demo.js');
    if (!dataLoaded) {
        return <Loading />;
    } else
        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Manage Ads Banner</h1>
                <p className="mb-4">Description</p>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6
                            className="m-0 font-weight-bold text-primary"
                            style={{ float: 'left' }}
                        >
                            Ads Banner List
                        </h6>
                        <Link to="/ads-banner-manage/create">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{ float: 'right' }}
                            >
                                Add New Ads Banner
                            </button>
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th>Ad Banner Image</th>
                                        <th>Ad Link</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adsBannerList.map(ad => (
                                        <tr key={ad.id}>
                                            <td>
                                                <img
                                                    src={
                                                        ad.ads_banner_image_path
                                                    }
                                                    alt="cover movie"
                                                    className="rounded mx-auto d-block"
                                                    width="300px"
                                                />
                                            </td>
                                            <td>{ad.ads_link}</td>
                                            <td>
                                                {ad.start_date} to {ad.end_date}
                                            </td>
                                            <td>
                                                {ad.status === '1'
                                                    ? 'Show'
                                                    : 'Hide'}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/ads-banner-manage/delete/${ad.id}`}
                                                >
                                                    Delete
                                                </Link>{' '}
                                                |{' '}
                                                <Link
                                                    to={`/ads-banner-manage/edit/${ad.id}`}
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
};

const AdsBannerCreate = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();

    const [imgBanner, setImgBanner] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(true);
    const [adsBanner, setAdsBanner] = useState({
        ads_link: '',
        start_date: '',
        end_date: '',
        status: '',
        ads_banner_image_path: '',
    });

    const handleInputChange = e => {
        e.persist();
        setAdsBanner({ ...adsBanner, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setDataLoaded(false);

        let updateAdsBanner = { ...adsBanner };
        if (imgBanner) {
            try {
                const imgRef = ref(storage, `uploads/adsBanner/${v4()}`);
                await uploadBytes(imgRef, imgBanner);
                const imgUrl = await getDownloadURL(imgRef);

                updateAdsBanner = {
                    ...adsBanner,
                    ads_banner_image_path: imgUrl,
                };

                axios
                    .post(jsonServer + '/adsBanner', updateAdsBanner)
                    .then(res => {
                        setDataLoaded(true);
                        window.location.href = '/ads-banner-manage';
                    });
            } catch (error) {
                window.alert('Error uploading ad banner image:', error);
            }
        } else {
            setDataLoaded(true);
            window.alert('Please select ad banner image');
        }
    };

    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Create New Ad Banner
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-ad-link">
                                Ad Link
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-ad-link"
                                name="ads_link"
                                onChange={handleInputChange}
                                value={adsBanner.ads_link}
                                placeholder="Enter Ad Link"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-start-date">
                                Start Date
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="input-start-date"
                                name="start_date"
                                onChange={handleInputChange}
                                value={adsBanner.start_date}
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-movie-end">
                                End Date
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="input-movie-end"
                                name="end_date"
                                onChange={handleInputChange}
                                value={adsBanner.end_date}
                                required
                            />
                        </div>

                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-ad-status">
                                Status
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="status"
                                className="form-control"
                                onChange={handleInputChange}
                                value={adsBanner.status}
                                required
                            >
                                <option>Choose status</option>
                                <option value="1">Show</option>
                                <option value="0">Hide</option>
                            </select>
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-ad-banner-image">
                                Ad Banner Image
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="file"
                                name="ads_banner_image_path"
                                onChange={e => setImgBanner(e.target.files[0])}
                                className="form-control-file"
                                id="input-ad-banner-image"
                            />
                        </div>
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Create
                            </button>
                        </div>
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button
                                type="submit"
                                className="btn btn-danger"
                                width="100%"
                            >
                                <Link
                                    to="/ads-banner-manage"
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Back to ad banner manage
                                </Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const AdsBannerEdit = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    const [imgBanner, setImgBanner] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [adsBanner, setAdsBanner] = useState({
        ads_link: '',
        start_date: '',
        end_date: '',
        status: '',
        ads_banner_image_path: '',
    });

    useEffect(() => {
        setDataLoaded(false);
        fetch(jsonServer + `/adsBanner/${id}`)
            .then(res => res.json())
            .then(data => {
                setAdsBanner(data);
                setDataLoaded(true);
            });
    }, [id]);

    const handleInputChange = e => {
        e.persist();
        setAdsBanner({ ...adsBanner, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setDataLoaded(false);

        let updateAdsBanner = { ...adsBanner };
        let oldAdsBanner = { ...adsBanner };
        if (imgBanner) {
            try {
                const imgRef = ref(storage, `uploads/adsBanner/${v4()}`);
                await uploadBytes(imgRef, imgBanner);
                const imgUrl = await getDownloadURL(imgRef);

                updateAdsBanner = {
                    ...adsBanner,
                    ads_banner_image_path: imgUrl,
                };
                try {
                    const oldImgRef = ref(
                        storage,
                        oldAdsBanner.ads_banner_image_path
                    );
                    await deleteObject(oldImgRef);
                } catch (error) {
                    if (error.code === 'storage/object-not-found') {
                        console.log(
                            'Image not found in Firebase Storage. No action taken.'
                        );
                    } else {
                        console.error(
                            'Error checking or deleting image:',
                            error
                        );
                    }
                }
            } catch (error) {
                window.alert('Error uploading ad banner image:', error);
            }
        } else {
            setDataLoaded(true);
        }
        axios
            .put(jsonServer + `/adsBanner/${id}`, updateAdsBanner)
            .then(res => {
                setDataLoaded(true);
                window.location.href = '/ads-banner-manage';
            });
    };

    if (!dataLoaded) {
        return <Loading />;
    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Edit Ad Banner
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <img
                        src={adsBanner.ads_banner_image_path}
                        alt="cover ad banner"
                        className="rounded mx-auto d-block"
                        width="80%"
                        // style={{ paddingBottom: '20px' }}
                    />
                </div>
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-ad-link">
                                Ad Link
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-ad-link"
                                name="ads_link"
                                onChange={handleInputChange}
                                value={adsBanner.ads_link}
                                placeholder="Enter Ad Link"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-start-date">
                                Start Date
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="input-start-date"
                                name="start_date"
                                onChange={handleInputChange}
                                value={adsBanner.start_date}
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-movie-end">
                                End Date
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="input-movie-end"
                                name="end_date"
                                onChange={handleInputChange}
                                value={adsBanner.end_date}
                                required
                            />
                        </div>

                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-ad-status">
                                Status
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                name="status"
                                className="form-control"
                                onChange={handleInputChange}
                                value={adsBanner.status}
                                required
                            >
                                <option>Choose status</option>
                                <option value="1">Show</option>
                                <option value="0">Hide</option>
                            </select>
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-ad-banner-image">
                                Ad Banner Image
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="file"
                                name="ads_banner_image_path"
                                onChange={e => setImgBanner(e.target.files[0])}
                                className="form-control-file"
                                id="input-ad-banner-image"
                            />
                        </div>
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Edit
                            </button>
                        </div>
                        <div className="col-md-6 mb-4 d-flex justify-content-center">
                            <button
                                type="submit"
                                className="btn btn-danger"
                                width="100%"
                            >
                                <Link
                                    to="/ads-banner-manage"
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Back to ad banner manage
                                </Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const AdsBannerDelete = () => {
    const { checkLogin } = useContext(UserContext);
    checkLogin();
    const { id } = useParams();

    useEffect(() => {
        if (window.confirm('Are you sure you want to delete this Ad?')) {
            fetch(jsonServer + `/adsBanner/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        window.alert('Ad deleted successfully.');
                        window.location.href = '/ads-banner-manage';
                    }
                })
                .catch(error => {
                    window.alert(
                        'Failed to delete this Ad. Please try again later.'
                    );
                });
        }
    }, [id]);
};

export { AdsBannerManage, AdsBannerCreate, AdsBannerEdit, AdsBannerDelete };
