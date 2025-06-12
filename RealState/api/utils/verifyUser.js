import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js'; // Make sure to use .js if you're using ES Modules (type: "module" in package.json)

export const verifyToken = (req, res, next) => {

  console.log('req.cookies', req.cookies);
  
  const token = req.cookies?.['Access-Token']; // Optional chaining for safety
  console.log('token9', token);
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, 'passTest', (err, decodedUser) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden'));
    }

    req.user = decodedUser;
    next();
  });
};
