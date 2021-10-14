const getAccess = (req, res) => {
    res.status(200);
    res.json({ message: 'Access granted' });
}

module.exports = {
    getAccess: getAccess,
}