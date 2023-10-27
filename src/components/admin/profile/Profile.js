import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const handleSubmit = () => {};
    const handleInputChange = () => {};
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 d-flex justify-content-center">
                Profile Name
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-5 mb-4 d-flex justify-content-center">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/fer201mprojectimagedb.appspot.com/o/uploads%2Favatar%2F0b00e9bc-be1e-40e6-9151-412cb7942d12?alt=media&token=123192f0-741e-4275-93e4-0a0b2482f75b"
                        alt="cover avatart"
                        // className="rounded mx-auto d-block"
                        // width="80%"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            // paddingBottom: '20px',
                        }}
                    />
                </div>
                <div className="col-md-5">
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-first-name">
                                First Name
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-theater-name"
                                name="firstName"
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-6">
                            <label htmlFor="input-last-name">
                                Last Name
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-theater-name"
                                name="lastName"
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-email">
                                Email
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="input-email"
                                name="email"
                                onChange={handleInputChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-username">
                                Username
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="input-username"
                                name="username"
                                onChange={handleInputChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="form-group mb-4 col-md-12">
                            <label htmlFor="input-theater-image">
                                Avatar Image
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="file"
                                name="theater_image_path"
                                // onChange={e => setImg(e.target.files[0])}
                                className="form-control-file"
                                id="input-theater-image"
                            />
                        </div>
                        <div className="col-md-12 mb-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
