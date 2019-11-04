export default {
  swagger: '2.0',
  info: {
    version: '1.0',
    title: 'Teamwork API Docs',
    description: 'Teamwork API documentation',
    contact: {}
  },
  host: process.env.BASE_url,
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/users/auth/signup': {
      post: {
        description: 'Signup a user',
        summary: 'User signup',
        tags: ['Users'],
        operationId: 'UsersAuthSignupPost',
        deprecated: false,
        produces: ['application/json'],
        consumes: ['application/x-www-form-urlencoded'],
        parameters: [
          {
            name: 'username',
            in: 'formData',
            required: true,
            type: 'string',
            description: ''
          }
        ]
      }
    }
  }
};
