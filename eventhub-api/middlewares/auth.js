const { verifyToken } = require('../config/jwt');
const User = require('../modules/user/userModel');

function unauthorized(res, message) {
    return res.status(401).json({ success: false, message, errors: [] });
}

async function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return unauthorized(res, 'Token de autenticação não informado.');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        return unauthorized(res, 'Token de autenticação inválido ou expirado.');
    }
    try {
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'isAdmin', 'isBlocked']
        });
        if (!user) {
            return unauthorized(res, 'Usuário não encontrado. Entre novamente.');
        }
        if (user.isBlocked) {
            return unauthorized(res, 'Sua conta foi bloqueada. Entre em contato com a administração.');
      }
        req.user = { id: user.id, username: user.username, isAdmin: Boolean(user.isAdmin) };
        return next();
    } catch (err) {
        return next(err);
    }
}

function isAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Acesso restrito a administradores.',
            errors: []
        });
    }
    return next();
}

module.exports = { isAuthenticated, isAdmin };