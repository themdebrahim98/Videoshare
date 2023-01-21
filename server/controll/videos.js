import { query } from "express";
import mongoose from "mongoose";
import { createError } from "../error.js";
import User from "../model/User.js";
import Videos from "../model/Videos.js";

export const addVideo = async (req, res, next) => {
  console.log(req.params)
  try {
    const video = new Videos({
      userId: req.user.id,
      ...req.body,
    });

    const savedVideo = await video.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Videos.findById(req.params.videoId);
    console.log(video, "video");

    if (!video) return next(createError(404, "video not found"));
    if (video.userId === req.user.id) {
      await Videos.findByIdAndDelete(req.params.videoId);
      res.status(200).send("videos succsesfuly deleted.");
    } else {
      return next(createError(404, "you can delete only your video"));
    }
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Videos.findById(req.params.videoId);

    if (!video) return next(createError(404, "video not found"));
    if (video.userId === req.user.id) {
      const updateVideo = await Videos.findByIdAndUpdate(
        req.params.videoId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).send(updateVideo);
    } else {
      return next(createError(404, "you can update only your video"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  console.log("fetvideo")
  try {
    const video = await Videos.findById(req.params.id);

    if (!video) return next(createError(404, "video not found"));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const viewVideo = async (req, res, next) => {
  try {
    const video = await Videos.findById(req.params.videoId);

    const isView = video.viedeoViewUsers.includes(req.user.id);
    if (!isView) {
      const updatedvideo = await Videos.findByIdAndUpdate(
        req.params.videoId,
        { $inc: { views: 1 }, $push: { viedeoViewUsers: req.user.id } },
        { new: true }
      );

      res.status(200).json("view has been increased");
    } else {
      res.status(200).json("already viewed this videos");
    }
  } catch (err) {
    next(err);
  }
};

export const randomVideo = async (req, res, next) => {
  try {
    const random = await Videos.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(random);
  } catch (err) {
    next(err);
  }
};

export const trendingVideo = async (req, res, next) => {
  console.log("trend")
  try {
 
    const trend = await Videos.find().sort({ views: -1 });
    res.cookie("ok","kljjkhhjkjkbhjgb")

    res.status(200).json(trend);
  } catch (err) {
    next(err);
  }
};

export const subVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const videos = await Promise.all(
      user.subscribedUsers.map((channelid) => {
        return Videos.find({ userId: channelid });
      })
    );

    res
      .status(200)
      .json(videos.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getVideoByTag = async (req, res, next) => {
  try {
    console.log(req.query);
    const tags = req.query.tags.split('+')
    const videos = await Videos.find({tags:{$in:tags} }).limit(40);

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const searchVideo = async (req, res, next) => {
  try {
   const query = req.query.q;
   const searchVideo = await Videos.find({ desc:{$regex:query,$options:"i"}});

    res.status(200).json(searchVideo);
  } catch (err) {
    next(err);
  }
};
