import { Request,Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
      const currentUser = await User.findOne({ _id: req.userId });
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(currentUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

// Define the createCurrentUser function
const createCurrentUser = async (req: Request, res: Response) => {
    try {
        // 1. Check if the user exists in the database
        const {auth0Id} = req.body;
        const existingUser = await User.findOne({auth0Id});
    
        // 2. If the user exists, send a 200 status code
        if(existingUser){
            return res.status(200).send();
        }
    
        // 3. If the user does not exist, create a new user
        const newUser = new User(req.body);
        await newUser.save();
    
        // 4. Return the newly created user object with a 201 status code
        res.status(201).json(newUser.toObject());
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something went wrong at server"});
    }
};

const updateCurrentUser = async(req: Request, res:Response)=>{
    try {
        const {name, address,country, city} = req.body;
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        user.name = name,
        user.address = address,
        user.city = city,
        user.country = country

        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error in updating the profile"});
    }
}
export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser
}
