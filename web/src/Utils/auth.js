import decodeJwt from 'jwt-decode';


export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    return true;
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
};


export const login = (data) => {
    const decodedToken = decodeJwt(data['access_token']);
    localStorage.setItem('token', data['access_token']);
    localStorage.setItem('permissions', decodedToken.permissions);
};


export const getToken = () => {
    return localStorage.getItem('token');
};

export const isJwtValid = () => {
    let token = localStorage.getItem('token');

    if(!token) {
        return false;
    }

    let decodedToken = decodeJwt(token);
    let currentDate = new Date();

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        //Our token is looking a little crusty and has a distinct "freshness" to it. 
        //Better get a new one!
        return false; 
    } else {
        //Token is present and hasn't expired yet. Woo!
        return true;
    }
};
