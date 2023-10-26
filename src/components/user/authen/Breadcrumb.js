export default function Breadcrumb({ title }) {
    return (
        <section
            className="normal-breadcrumb"
            style={{
                backgroundImage:
                    'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWUlMjB0aWNrZXRzfGVufDB8fDB8fHww&w=1000&q=80)',
                backgroundPosition: 'center',
            }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <div className="normal__breadcrumb__text">
                            <h2>{title}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
