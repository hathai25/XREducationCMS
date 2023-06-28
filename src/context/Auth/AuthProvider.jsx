import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [authData, setAuthData] = useState({
        expires: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const signInUser = (success, error) => {
        if (success) {
            localStorage.setItem("token", success?.token);
            localStorage.setItem("expires", success?.expires);
            setAuthData({
                expires: success?.expires,
                token: success?.token,
                isAuthenticated: true,
                isLoading: false,
            });
        }
        if (error) {
            setAuthData({
                ...authData,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    };

    const signOutUser = () => {
        setAuthData({
            expires: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
        });
        localStorage.removeItem("token");
    }

    useEffect(() => {
        const getAuthUser = () => {
            const token = localStorage.getItem("token");
            const expires = localStorage.getItem("expires");

            if (!token || (Date.now() >= expires*1000)) {
                setAuthData({
                    expires: null,
                    token: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
                navigate("/login");
            }
        };

        getAuthUser();
    }, []);


    return (
        <AuthContext.Provider value={{...authData, signInUser, signOutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
