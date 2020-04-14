module.exports = {
    '/public-api/login': {
        post: {
            operationId: 'login',
            security: [],
            description: 'Action to login inside BE',
            requestBody: {
                description: 'Username and Password',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'password'],
                            properties: {
                                username: {type: 'string'},
                                password: {
                                    type: 'string',
                                    format: 'password'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'login success',
                    content: {'application/json': {schema: {$ref: '#/components/schemas/Error'}}}
                },
                default: {
                    description: 'Error',
                    content: {'application/json': {schema: {$ref: '#/components/schemas/Error'}}}
                }
            }
        }
    }
};
