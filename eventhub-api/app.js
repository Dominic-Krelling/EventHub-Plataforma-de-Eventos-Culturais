var express =
    require('express');

var logger =
    require('morgan');

var cors =
    require('cors');

var path =
    require('path');

require('dotenv')
    .config();

var indexRouter =
    require(
        './routes/index'
    );

var searchRoutes =
    require(
        './modules/search/searchRoutes'
    );

var userRoutes =
    require(
        './modules/user/userRoutes'
    );

var errorHandler =
    require(
        './middlewares/errorHandler'
    );

var app =
    express();

app.use(
    logger('dev')
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cors({
        origin:
            process.env.CORS_ORIGIN ||
            'http://localhost:5173',

        credentials: true
    })
);

/*
 * Arquivos públicos.
 *
 * Exemplo:
 * /uploads/profiles/default-profile.png
 */
app.use(
    '/uploads',

    express.static(
        path.join(
            __dirname,
            'public/uploads'
        )
    )
);

/*
 * Rotas da API
 */
app.use(
    '/api',
    indexRouter
);

app.use(
    '/api',
    searchRoutes
);

app.use(
    '/api',
    userRoutes
);

/*
 * 404
 */
app.use(
    (req, res) => {
        res.status(404)
            .json({
                success: false,

                message:
                    'Rota não encontrada.',

                errors: []
            });
    }
);

/*
 * Error handler
 */
app.use(
    errorHandler
);

const sequelize =
    require(
        './config/database'
    );

sequelize
    .sync({
        alter: true
    })
    .then(() => {
        console.log(
            'Banco de dados sincronizado!'
        );
    })
    .catch((err) => {
        console.error(
            'Erro ao sincronizar banco:',
            err
        );
    });

module.exports = app;