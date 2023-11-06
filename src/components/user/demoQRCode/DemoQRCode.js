import QRCode from 'react-qr-code';

export default function QRCodeFakePayment() {
    return (
        <>
            <QRCode
                size={200}
                bgColor="white"
                fgColor="black"
                value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            />
        </>
    );
}
