let statusCode = require('../../../utils/statusCode');
let jwt = require('jsonwebtoken');
dotenv.config();

let refresh = async (req, res) => {
    try {
        // Retrieve access token and refresh token from cookies
        const accessToken = req.cookies && req.cookies.accessToken;   
        const refreshToken = req.cookies && req.cookies.refreshToken;   
        
        // Verify access token
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
        console.log('Decoded access token:', decodedAccessToken);
        
        // Check if access token is expired
        if (decodedAccessToken.exp * 1000 <= Date.now()) {
            // Access token is expired or about to expire
            
            // Verify refresh token
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log('Decoded refresh token:', decodedRefreshToken);

             // Check if refresh token is expired
             if (decodedRefreshToken.exp * 1000 <= Date.now()) {
                // Refresh token is expired
                return res.status(statusCode.UNAUTHORIZED.code).json({ message: 'Please log in again.' });
            }
            // Use refresh token to generate new access token
            var newAccessToken = jwt.sign({ 
                id: decodedRefreshToken.id, 
                user_name: decodedRefreshToken.user_name, 
                email_id: decodedRefreshToken.email_id 
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1day' });
            console.log('New access token:', newAccessToken);
            
            // Update access token in cookies
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            };
            res.cookie('accessToken', newAccessToken, options);
        }
        
        // Return response with new access token
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        // Handle invalid tokens or other errors
        return res.status(statusCode.FORBIDDEN.code).json({ message: error.message });
    }
}


module.exports = {
    refresh
}