import { jwtDecode } from 'jwt-decode';
import instance from '../../../env';
import axiosHttpClient from "../axios";

/**
 * function to get token from storage
 * @returns accessToken, refreshToken
 */
export function getToken() {
    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = sessionStorage.getItem("accessToken");

    return { accessToken, refreshToken };
}

/**
 * function to remove token from local system
 * @param {string} tokenName
 * @returns
 */
export function removeToken(tokenName) {
    if (tokenName == "refreshToken") {
        localStorage.removeItem("refreshToken");
    }
    if (tokenName == "accessToken") {
        sessionStorage.removeItem("accessToken");
    }
    return;
}

/**
 * function to save token
 * @param {string} tokenName 
 * @param {string} token 
 */
export function saveToken(tokenName, token) {
    if (tokenName == "refreshToken") {
        localStorage.setItem("refreshToken", token);
    }
    if (tokenName == "accessToken") {
        sessionStorage.setItem("accessToken", token);
    }
    return;
}

export function isTokenExpired(tokenName, token) {
    const { exp, iat } = jwtDecode(token);
    const issueDate = new Date(iat * 1000);
    const expirationDate = new Date(exp * 1000);
    // if (tokenName == 'accessToken') {
    //     expirationDate.setDate(issueDate.getDate());
    // }
    // if (tokenName == "refreshToken") {
    //     expirationDate.setDate(issueDate.getDate());
    // }
    // console.log("isTokenExpired", expirationDate < new Date(), expirationDate, new Date());
    return expirationDate < new Date();
}

export function isLoggedIn() {
    const { accessToken, refreshToken } = getToken();
    // console.log("isLoggedIn", { accessToken, refreshToken });

    if (!accessToken) return false;

    try {
        return !isTokenExpired("accessToken", accessToken);
    } catch (e) {
        return false;
    }
}

export async function refreshAccessToken() {
    const { accessToken, refreshToken } = getToken();
    // console.log("refresh token func start", { accessToken, refreshToken });

    if (!refreshToken) {    //is refresh token present
        // console.log(1)
        removeToken("accessToken");
        removeToken("refreshToken");
        sessionStorage.setItem("isUserLoggedIn", 0);
        sessionStorage.setItem("isAdminLoggedIn", 0)
        return null;
    }
    else {  // if present, then check validity of token
        let isRefreshTokenValid = isTokenExpired("refreshToken", refreshToken);
        if(!isRefreshTokenValid) {
            // console.log("refreshAccessToken func expired", isRefreshTokenValid);
            return null;
        }
    }

    try {
        // console.log(2)
        const response = await axiosHttpClient("REFRESH_TOKEN_API", "post");
        // console.log("refreshAccessToken func", response);

        sessionStorage.setItem("isUserLoggedIn", 1);
        sessionStorage.setItem("isAdminLoggedIn", 1);
        saveToken("accessToken", response.data.accessToken);
        return response.data.accessToken;
    }
    catch (error) {
        // console.log(5, error);
        sessionStorage.setItem("isUserLoggedIn", 0);
        sessionStorage.setItem("isAdminLoggedIn", 0)
        return null;
    }
}