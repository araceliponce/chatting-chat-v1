const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const secret = process.env.SECRET || 'thisemptycanbenot';
const expiration = process.env.JWT_EXPIRES_IN || '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // console.log('Authorization Header:', req.headers.authorization); 

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.error('No token found');
      return req; // no token, no user
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // console.log('Decoded user:', data); ojo
      req.user = data;
      // return { user: data }

    } catch (err) {
      // console.log('Invalid token');
      console.error('Token verification failed:', err.message);
      return {}; //
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
