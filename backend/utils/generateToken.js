import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // cookie cannot be accessed by client side javascript and prevents XSS attacks cross site scripting attacks
        sameSite:"strict", // cookie is sent only to the same site as the one that originated it
        secure: process.env.NODE_ENV !== "development"// cookie will only be set on HTTPS
    })
}

export default generateTokenAndSetCookie;
