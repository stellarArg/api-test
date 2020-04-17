module.exports = {
    schemas: {
        ArrayString: {
            type: 'array',
            uniqueItems: true,
            items: {type: 'string'}
        },
        ArrayNumber: {
            type: 'array',
            uniqueItems: true,
            items: {type: 'integer'}
        },
        Role: {
            type: 'object',
            properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                order: {type: 'integer'}
            }
        },
        ids: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'string',
                format: 'uuid'
            }
        },
        Persons: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                    nullable: true
                },
                name: {type: 'string'},
                surname: {type: 'string'},
                email: {
                    type: 'string',
                    format: 'email'
                },
                gender: {type: 'string'},
                avatar: {type: 'string'}
            }
        },
        Error: {
            type: 'object',
            required: [
                'code',
                'message'
            ],
            properties: {
                code: {
                    type: 'integer',
                    format: 'int32'
                },
                message: {type: 'string'}
            }
        }
    },
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};
