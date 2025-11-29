const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Diary PaaS API',
            version: '1.0.0',
            description: 'Dokumentasi API untuk aplikasi Catatan Harian (PaaS)',
            contact: {
                name: 'Backend Developer'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    // Ini penting! Beritahu swagger di mana kita menulis komentar dokumentasi
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(options);
module.exports = swaggerDocs;