// Utility functions for JWT token management
export const authUtils = {
    // Get stored token
    getToken: () => {
        return localStorage.getItem('jwtToken');
    },

    // Get user data
    getUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;

        // Check if token is expired (basic check)
        try {
            //decode payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            //second and millisecond conversion(00:00:00 UTC on January 1, 1970)
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
    },

    // Get authorization header for API calls
    getAuthHeader: () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// API service for authenticated requests
export const apiService = {
    // Make authenticated API call
    authenticatedFetch: async (url, options = {}) => {
        const authHeader = authUtils.getAuthHeader();
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
                ...options.headers,
            },
        });

        if (response.status === 401) {
            // Token expired or invalid
            authUtils.logout();
            throw new Error('Authentication required');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    // Simple fetch without authentication (for login/register)
    simpleFetch: async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
};