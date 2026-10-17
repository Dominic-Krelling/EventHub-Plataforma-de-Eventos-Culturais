const User = require('./userModel');

const bcrypt =
    require('bcryptjs');

const fs =
    require('fs');

const path =
    require('path');

const Event = require('../event/eventModel')

const {
    generateToken
} = require('../../config/jwt');

async function registerUser(
    username,
    email,
    password,
    fullName
) {
    const emailExists =
        await User.findOne({
            where: {
                email
            }
        });

    const usernameExists =
        await User.findOne({
            where: {
                username
            }
        });

    if (
        emailExists ||
        usernameExists
    ) {
        const error =
            new Error(
                'Este e-mail ou usuário já está cadastrado.'
            );

        error.status = 500;

        throw error;
    }

    const salt =
        await bcrypt.genSalt(10);

    const hashedPassword =
        await bcrypt.hash(
            password,
            salt
        );

    const newUser =
        await User.create({
            username,
            email,
            password: hashedPassword,
            fullName
        });

    return {
        id: newUser.id,
        username:
            newUser.username,
        email:
            newUser.email
    };
}

async function loginUser(
    email,
    password
) {
    const user =
        await User.findOne({
            where: {
                email
            }
        });

    if (!user) {
        const error =
            new Error(
                'E-mail ou senha inválidos.'
            );

        error.status = 500;

        throw error;
    }

    const passwordIsCorrect =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordIsCorrect) {
        const error =
            new Error(
                'E-mail ou senha inválidos.'
            );

        error.status = 500;

        throw error;
    }

    if (user.isBlocked) {
        const error =
            new Error(
                'Usuário bloqueado.'
            );

        error.status = 403;

        throw error;
    }

    const token =
        generateToken(user);

    return {
        token,

        user: {
            id: user.id,

            username:
                user.username,

            email:
                user.email,

            fullName:
                user.fullName,

            bio:
                user.bio,

            profilePicture:
                user.profilePicture,

            followersCount:
                user.followersCount,

            followingCount:
                user.followingCount,

            eventsCount:
                user.eventsCount,

            isAdmin:
                user.isAdmin
        }
    };
}

async function getPublicProfile(username) {
  const user = await User.findOne({
    where: { username },
    attributes: [
      'id',
      'username',
      'fullName',
      'bio',
      'profilePicture',
      'followersCount',
      'followingCount',
      'eventsCount'
    ]
  })

  if (!user) {
    const error = new Error('Usuário não encontrado.')
    error.status = 404
    throw error
  }

  const events = await Event.findAll({
    where: { userId: user.id },
    attributes: [
      'id',
      'title',
      'description',
      'image',
      'viewsCount',
      'createdAt'
    ],
    order: [['createdAt', 'DESC']]
  })

  return {
    ...user.toJSON(),
    events
  }
}

async function getUserProfile(
    userId
) {
    const user =
        await User.findByPk(
            userId,

            {
                attributes: [
                    'id',
                    'username',
                    'email',
                    'fullName',
                    'bio',
                    'profilePicture',
                    'followersCount',
                    'followingCount',
                    'eventsCount',
                    'isAdmin'
                ]
            }
        );

    if (!user) {
        const error =
            new Error(
                'Usuário não encontrado.'
            );

        error.status = 404;

        throw error;
    }

    return user;
}

async function updateUserProfile(
    userId,
    fullName,
    bio,
    newProfilePicture = null
) {
    const user =
        await User.findByPk(
            userId
        );

    if (!user) {
        const error =
            new Error(
                'Usuário não encontrado.'
            );

        error.status = 404;

        throw error;
    }

    const oldProfilePicture =
        user.profilePicture;

    user.fullName =
        fullName;

    user.bio =
        bio || '';

    if (newProfilePicture) {
        user.profilePicture =
            newProfilePicture;
    }

    await user.save();

    if (
        newProfilePicture &&
        oldProfilePicture &&
        oldProfilePicture !==
            'default-profile.png' &&
        oldProfilePicture !==
            newProfilePicture
    ) {
        const oldImagePath =
            path.join(
                __dirname,
                '../../public/uploads/profiles',
                path.basename(
                    oldProfilePicture
                )
            );

        if (
            fs.existsSync(
                oldImagePath
            )
        ) {
            try {
                fs.unlinkSync(
                    oldImagePath
                );
            } catch (error) {
                console.error(
                    'Não foi possível remover a foto antiga:',
                    error.message
                );
            }
        }
    }

    return {
        id:
            user.id,

        username:
            user.username,

        email:
            user.email,

        fullName:
            user.fullName,

        bio:
            user.bio,

        profilePicture:
            user.profilePicture,

        followersCount:
            user.followersCount,

        followingCount:
            user.followingCount,

        eventsCount:
            user.eventsCount,

        isAdmin:
            user.isAdmin
    };
}

module.exports = {
    registerUser,
    loginUser,
    getPublicProfile,
    getUserProfile,
    updateUserProfile
};