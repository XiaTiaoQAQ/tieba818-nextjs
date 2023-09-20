import {createContext, useState, useContext} from 'react';
import {Dialog, CircularProgress, Typography} from '@mui/material';

const LoadingDialogContext = createContext({
    show: (message) => {
    },
    close: () => {
    },
});

export const LoadingDialogProvider = ({children}) => {
    const [dialogData, setDialogData] = useState({open: false, message: ''});

    const showLoadingDialog = (message) => {
        if (!message) {
            message = '正在加载中...';
        }
        setDialogData({open: true, message});
    };

    const closeLoadingDialog = () => {
        setDialogData({open: false, message: ''});
    };

    return (
        <LoadingDialogContext.Provider value={{show: showLoadingDialog, close: closeLoadingDialog}}>
            {children}
            <Dialog open={dialogData.open}>
                <div style={{padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <CircularProgress/>
                    {dialogData.message && <Typography style={{marginTop: '16px'}}>{dialogData.message}</Typography>}
                </div>
            </Dialog>
        </LoadingDialogContext.Provider>
    );
};

export const useLoadingDialog = () => {
    const context = useContext(LoadingDialogContext);
    if (context === undefined) {
        throw new Error('useLoadingDialog must be used within a LoadingDialogProvider');
    }
    return context;
};
