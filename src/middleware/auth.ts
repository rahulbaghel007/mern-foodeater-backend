// Import necessary modules for authentication and request handling
import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Extend the Express Request interface to include user-related properties
// Adding additional properties to Req with typeScript
declare global {
 namespace Express {
    interface Request {
      userId: String; // Property to store the user's ID
      auth0Id: String; // Property to store the user's Auth0 ID
    }
 }
}

// Configure JWT authentication middleware with Auth0 settings
export const jwtCheck = auth({
    audience: 'mern-food-delivary-app-api', // The audience for the JWT
    issuerBaseURL: 'https://dev-rwhcf160bmhmvug8.us.auth0.com/', // The issuer URL for the JWT
    tokenSigningAlg: 'RS256' // The algorithm used to sign the JWT
})

// Middleware to parse and validate JWT tokens from the Authorization header
export const jwtParse = async (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 // Extract the Authorization header from the request
 const { authorization } = req.headers;

 // Check if the Authorization header exists and starts with "Bearer "
 if (!authorization || !authorization.startsWith("Bearer ")) {
    // If not, respond with a 401 Unauthorized status
    return res.sendStatus(401);
 }

 // Extract the token from the Authorization header
 const token = authorization.split(" ")[1];

 try {
    // Decode the JWT token to get the payload
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub; // Extract the subject (user ID) from the payload

    // Find the user in the database using the Auth0 ID
    const user = await User.findOne({ auth0Id });

    // If the user is not found, respond with a 401 Unauthorized status
    if (!user) {
      return res.sendStatus(401);
    }

    // Attach the Auth0 ID and user ID to the request object for use in subsequent middleware
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next(); // Proceed to the next middleware
 } catch (error) {
    // If there's an error, respond with a 401 Unauthorized status
    return res.sendStatus(401);
 }
};
