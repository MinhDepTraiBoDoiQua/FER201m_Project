// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // WebSocket server URL

// function Demo() {
//     const [buttonColor, setButtonColor] = useState('red');
//     const [id, setId] = useState();

//     useEffect(() => {
//         socket.on('update-button', color => {
//             setButtonColor(color);
//         });

//         socket.on('getId', data => {
//             setId(data);
//         });
//     }, []);

//     const handleButtonClick = () => {
//         const newColor = buttonColor === 'green' ? 'red' : 'green';
//         socket.emit('button-clicked', newColor);
//     };

//     return (
//         <div>
//             <h3 style={{ color: 'white' }}>Client ID: {id}</h3>
//             <button
//                 onClick={handleButtonClick}
//                 style={{ backgroundColor: buttonColor }}
//             >
//                 Button A
//             </button>
//             <button style={{ backgroundColor: 'red' }}>Button B</button>
//         </div>
//     );
// }

// export default Demo;
