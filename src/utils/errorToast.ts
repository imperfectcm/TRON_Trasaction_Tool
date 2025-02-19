import toast from 'react-hot-toast';

export const privateKeyErrorToast = () => {
    return toast.error('Enter private key to do this action', {
        position: 'bottom-center',
        style: {
            border: '1px solid #ff6c33',
            padding: '1rem',
            color: 'rgb(212 212 216)',
            backgroundColor: 'rgb(24 24 27)',
        },
    });
}
export const anyErrorToast = (errorMessage: string) => {
    return toast.error(errorMessage, {
        position: 'bottom-center',
        style: {
            border: '1px solid #ff6c33',
            padding: '1rem',
            color: 'rgb(212 212 216)',
            backgroundColor: 'rgb(24 24 27)',
        },
    });
}