import mongoose from "mongoose";
import User from "../model/User.js";
import { createError } from "../error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { json } from "express";

export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({
        message: "User already exist, please login!!",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = await new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).json({
      message: "User created successfully!",
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not exist!." });
    }

    const isFromGoogle = user?.fromGoogle;
    if (isFromGoogle) {
      return res.status(400).json({ message: "Please login with Google." });
    }

    const isCorrectPass = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isCorrectPass) {
      res.status(400).json({ message: "Invalid Email and Password!" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECRETKEY);
      res.cookie("user-token", token, {}).status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    // Check if the user exists in the database based on their email
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If the user exists, generate a JWT token and send it in the response
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRETKEY);
      return res
        .cookie("user-token", token)
        .status(200)
        .json(existingUser._doc);
    } else {
      // If the user doesn't exist, create a new user with the provided details
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();

      // Generate JWT token for the new user
      const token = jwt.sign({ id: savedUser._id }, process.env.SECRETKEY);
      return res.cookie("user-token", token).status(200).json(savedUser._doc);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.clearCookie("user-token");
    res.send("log out successfullty");

    next();
  } catch (err) {
    next(err);
  }
};
