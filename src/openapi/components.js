module.exports = {
    schemas: {
        User: {
            type: 'object',
            properties: {
                id: {
                    description: 'id of user',
                    type: 'string',
                    format: 'uuid'
                },
                username: {
                    description: 'Username.',
                    type: 'string'
                },
                name: {
                    description: 'Name.',
                    type: 'string'
                },
                surname: {
                    description: 'Surname.',
                    type: 'string'
                },
                documentId: {
                    description: 'Document or CUIT.',
                    type: 'string'
                },
                email: {
                    description: 'Email.',
                    type: 'string',
                    format: 'email'
                },
                deleted: {
                    type: 'boolean',
                    description: 'If the user its deleted from the current APP'
                }
            },
            required: [
                'id',
                'name',
                'surname',
                'documentId',
                'email',
                'deleted'
            ]
        },
        Profile: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    nullable: true
                },
                success: {
                    type: 'boolean',
                    nullable: true
                },
                user: {
                    allOf: [{$ref: '#/components/schemas/User'}],
                    type: 'object',
                    required: [
                        'roles'
                    ],
                    properties: {
                        role: {
                            type: 'array',
                            items: {type: 'string'}
                        },
                        attributes: {type: 'object'}
                    }
                }
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
