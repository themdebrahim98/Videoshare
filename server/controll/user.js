import mongoose from "mongoose";
import Video from '../model/Videos.js'
import { createError } from "../error.js";
import User from "../model/User.js";

export const updateUSer = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      console.log(user, "knj");
      res.status(200).json(user);
      next();
    } else {
      next(createError(401, "you can update only your account!"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUSer = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      const user = await User.findByIdAndDelete(req.params.id, { new: true });
      res.status(200).json("succsesfully deleted");
      next();
    } else {
      next(createError(401, "you can delete only your account!"));
    }
  } catch (err) {
    next(err);
  }
  // const user = await User.findOne({})
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
    next();
  } catch (err) {
    next(err);
  }
  // const user = await User.findOne({})
};

export const subUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const currUSer = await User.findById(req.user.id);
    const isSubscribed = currUSer.subscribedUsers.includes(user._id);
    if (!isSubscribed) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { subscribedUsers: req.params.id } },
        { new: true }
      );
      await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
      res.status(200).send("succsesfuly subscribed..");
    } else {
      res.status(200).send("already subscribed!");
    }
  } catch (err) {
    next(err);
  }
  // const user = await User.findOne({})
};

export const unSubUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const currUSer = await User.findById(req.user.id);
    const isSubscribed = currUSer.subscribedUsers.includes(user._id);
    if (isSubscribed) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { subscribedUsers: req.params.id } },
        { new: true }
      );
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).send("succsesfuly unsubscribed.");
    } else {
      res.status(200).send("already unsubscribed!");
    }
  } catch (err) {
    next(err);
  }
  // const user = await User.findOne({})
};

export const like = async (req, res, next) => {
  console.log("like")
  try {
    const id = req.user.id;
    console.log(id)
    const videoId = req.params.id;
    await Video.findByIdAndUpdate(
      videoId,
      {$addToSet:{likes:id},$pull:{disLikes:id}}
    )
    res.status(200).json("video has been liked")
    
  }catch (err) {
    next(err);
  }
  // const user = await User.findOne({})
};

export const disLike = async (req, res, next) => {
  
  try {
    const id = req.user.id;
    const videoId = req.params.id;
    await Video.findByIdAndUpdate(
      videoId,
      {$addToSet:{disLikes:id},$pull:{likes:id}}
    )
    res.status(200).json("video has been disliked")
    
  }catch (err) {
    next(err);
  }

};
