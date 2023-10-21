import { useEffect } from 'react';

// const useScript = url => {
//     useEffect(() => {
//         const script = document.createElement('script');

//         script.src = url;

//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, [url]);
// };

const useScript = (isDataLoad, url) => {
    useEffect(() => {
        if (isDataLoad) {
            // Create a script element
            const script = document.createElement('script');
            script.src = url; // Set the source

            // Add the script to the document's head
            document.head.appendChild(script);

            // Optional: You can also remove the script after it has been executed
            script.onload = () => {
                document.head.removeChild(script);
            };
        }
    }, [isDataLoad, url]);
};

export default useScript;
