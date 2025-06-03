import { CSSProperties } from "react";
import toast from "react-hot-toast";

const commonStyle: CSSProperties = {
    background: '#333',
    color: 'white',
    padding: '1em',
    textAlign: 'left',
    fontFamily: 'Cascadia Code',
    fontSize: '14px'
};

const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64"><g fill="#ff5a79"><path d="M37 42.4H27L23 2h18z" /><ellipse cx="32" cy="54.4" rx="7.7" ry="7.6" /></g></svg>;

const infoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M12.432 0c1.34 0 2.01.912 2.01 1.957c0 1.305-1.164 2.512-2.679 2.512c-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0M8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141c-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467c1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271c.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20" /></svg>;

const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#3498db" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z" /></svg>

export const snackbar = {
    error: (message: string, duration = 1500) => {
        toast.error(<span>{message}</span>, {
            duration,
            style: commonStyle,
            icon: errorIcon,
        });
    },
    success: (message: string, duration = 1500) => {
        toast.success(<span>{message}</span>, {
            duration,
            style: commonStyle,
            icon: successIcon,
        });
    },
    info: (message: string, duration = 1500) => {
        toast.success(<span>{message}</span>, {
            duration,
            style: commonStyle,
            icon: infoIcon,
        });
    },
};