const { verifyToken } = require('../config/jwt');

function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticação não informado.',
            errors: []
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticação inválido ou expirado.',
            errors: []
        });
    }
}

module.exports = {
    isAuthenticated
};