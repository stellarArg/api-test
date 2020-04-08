const components = require('./components');
const publicApi = require('./publicApi');
const api = require('./api');
const pkg = root_path('package.json');

module.exports = {
    openapi: '3.0.2',
    info: {
        title: pkg.description,
        version: pkg.version
    },
    servers: [
        {url: 'http://localhost:5000'}
    ],
    security: [
        {bearerAuth: []}
    ],
    paths: {
        '/ping': {
            get: {
                operationId: 'ping',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {version: {type: 'string'}}
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
        },
        '/ready': {
            get: {
                operationId: 'getStatus',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {type: 'string'},
                                        status: {type: 'string'},
                                        deps: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {}
                                            }
                                        }
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
        },
        '/health': {
            get: {
                operationId: 'getHealth',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {type: 'string'},
                                        status: {type: 'string'}
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
        },
        '/swagger': {
            get: {
                operationId: 'getHealth',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {}
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
        },
        ...publicApi,
        ...api
    },
    components
};
