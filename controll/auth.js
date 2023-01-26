import mongoose from "mongoose";
import User from "../model/User.js";
import { createError } from "../error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.passward, salt);
    const newUser = await new User({ ...req.body, passward: hash });
    await newUser.save();
    res.status(200).send("user has been created");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  console.log("ok");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found"));
    const isCorrectPass = await bcrypt.compare(
      req.body.passward,
      user.passward
    );
    if (!isCorrectPass) {
      return next(createError(400, "wrong credentials"));
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECRETKEY);
      res.cookie("user-token", token, {}).status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRETKEY);
      res.cookie("user-token", token).status(200).json(user._doc);
    } else {
      const newUSer = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUSer.save();
      res.cookie("user-token", token).status(200).json(savedUser._doc);
    }
  } catch (error) {
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
