import ReactLoading from 'react-loading';

export default function Loading() {
    return (
        <div style={styles.loadingComponent}>
            <ReactLoading type="spin" color="#357edd" />
        </div>
    );
}

const styles = {
    loadingComponent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh', // Adjust the height as needed to center it vertically
    },
};
