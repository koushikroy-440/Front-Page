const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');
const { response } = require('../app');
const refreshToken = async (uid, req) => {
    const endpoint = req.get('origin') || "http://" + req.get('host');
    const option = {
        body: uid,
        endpoint: endpoint,
        originalUrl: req.originalUrl,
        iss: endpoint + req.originalUrl,
    }
    const expiresIn = 86400;
    const newToken = await tokenService.createCustomToken(option, expiresIn);
    //update new token in database
    const updateMe = {
        token: newToken,
        expiresIn: 86400,
        updatedAt: Date.now()
    }
    await dbService.updateByQuery(uid, 'user', updateMe);
    return newToken;
}

const checkUserLog = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const query = {
            token: req.cookies.authToken,
            isLogged: true,
        }
        const userData = await dbService.getRecordByQuery(query, 'user');
        if (userData.length > 0) {
            const newToken = await refreshToken(tokenData.data, req);
            res.cookie("authToken", newToken, { maxAge: (86400 * 1000) });
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }


}

const logout = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const query = {
            token: req.cookies.authToken,
        }
        const updateMe = {
            isLogged: false,
            updatedAt: Date.now()
        }
        const userRes = await dbService.updateByQuery(query, 'user', updateMe);
        if (userRes.nModified) {
            await res.clearCookie("authToken");
            res.redirect('/');
        } else {
            res.redirect("/profile");
        }
    } else {
        res.status(401);
        res.json({
            message: "permission denied !"
        });
    }
}

module.exports = {
    checkUserLog: checkUserLog,
    logout: logout
}