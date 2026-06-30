const jwt = require('jsonwebtoken');

const secret = '7f4a9c1d8e2b5f6a9c8d7e4f1a2b3c4d5e6f7a8b';
const token = jwt.sign({ userId: 'test-user', role: 'USER' }, secret, { expiresIn: '1h' });
console.log(token);
