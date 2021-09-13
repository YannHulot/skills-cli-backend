import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_ALGORITHM } from '../types/auth';

// Generate a signed JWT token with the tokenId in the payload
export const generateAuthToken = (tokenId: number): string => {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  });
};

// Generate a random 8 digit number as the email token
export const generateEmailToken = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};
