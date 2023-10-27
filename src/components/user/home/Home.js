import Banner from './Banner';
import { Col, Container, Row } from 'react-bootstrap';
import Showing from './Showing';
import ComingSoon from './ComingSoon';
import TopView from './TopView';

export default function Home() {
    return (
        <>
            <Banner />
            <section className="product spad">
                <Container>
                    <Row>
                        <Col lg={8}>
                            <Showing />
                            <ComingSoon />
                        </Col>
                        <Col>
                            <TopView />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}
