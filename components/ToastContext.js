import {createContext, useState, useContext} from 'react';
import {Snackbar} from '@mui/material';

const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const [toastData, setToastData] = useState({open: false, message: ''});

    const showToast = (message) => {
        setToastData({open: true, message});
    };

    const closeToast = () => {
        setToastData({open: false, message: ''});
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                open={toastData.open}
                onClose={closeToast}
                message={toastData.message}
                autoHideDuration={6000}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
