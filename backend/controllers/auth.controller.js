import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPasswaord, gender } = req.body;

    if (password !== confirmPasswaord) {
      return res.status(400).json({ error: "Password do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePicture : girlProfilePicture,
    });

    if (newUser) {
      //Generate JWT token

      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else{
      res.status(400).json({ error: "Invalid user data" });
    }

  } catch (error) {
    console.error("Error signing up", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user || !isPasswordCorrect){
      return res.status(400).json({error: "Invalid username or password"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
    
  } catch (error) {
    console.error("Error logging in", error.message);
    res.status(500).json({ error: "Internal server error" }); 
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
  } catch (error) {
    console.error("Error logging out", error.message);
    res.status(500).json({ error: "Internal server error" });
    
  }
};
