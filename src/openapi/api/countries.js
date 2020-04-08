module.exports = {
    '/api/countries': {
        get: {
            security: [],
            summary: 'List Countries',
            responses: {
                200: {
                    description: 'login success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    countries: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'string',
                                                    format: 'uuid'
                                                },
                                                name: {type: 'string'}
                                            }
                                        }
                                    },
                                    total: {type: 'integer'},
                                    limit: {type: 'integer'}
                                }
                            }
                        }
                    }
                },
                default: {
                    description: 'Error',
                    content: {'application/json': {schema: {$ref: '#/components/schemas/Error'}}}
                }
            }
        },
        put: {
            security: [],
            summary: 'List Countries',
            responses: {
                200: {
                    description: 'login success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    countries: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'string',
                                                    format: 'uuid'
                                                },
                                                name: {type: 'string'}
                                            }
                                        }
                                    },
                                    total: {type: 'integer'},
                                    limit: {type: 'integer'}
                                }
                            }
                        }
                    }
                },
                default: {
                    description: 'Error',
                    content: {'application/json': {schema: {$ref: '#/components/schemas/Error'}}}
                }
            }
        }
    }
};
