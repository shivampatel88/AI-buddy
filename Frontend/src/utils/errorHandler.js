import { toast } from 'react-hot-toast';

export const handleApiError = (error, navigate = null, defaultMessage = 'An unexpected error occurred.') => {
    console.error("API Error caught:", error);
    const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        defaultMessage;

    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        toast.error("Session expired. Please login again.");
        if (navigate) {
            navigate('/login');
        }
    } else {
        toast.error(errorMessage);
    }
};
