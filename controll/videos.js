import { query } from "express";
import mongoose from "mongoose";
import { createError } from "../error.js";
import User from "../model/User.js";
import Videos from "../model/Videos.js";

export const addVideo = async (req, res, next) => {
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

    if (!video) return next(createError(404, "video not found"));
    if (video.userId === req.user.id) {
      await Videos.findByIdAndDelete(req.params.videoId);
      res.status(200).send("videos successfully deleted.");
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
        { $addToSet: { viedeoViewUsers: req.user.id } },
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
  try {
    const trend = await Videos.find().sort({ viedeoViewUsers: -1 });
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
        return Videos.find({ userId: channelid }).sort({ createdAt: -1 });
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
    const tags = req.query.tags.split("+");
    const videos = await Videos.find({ tags: { $in: tags } })
      .limit(40)
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const searchVideo = async (req, res, next) => {
  try {
    let query = req.query.q.trim();
    const searchVideo = await Videos.find({
      title: { $regex: query, $options: "isg" },
    });

    res.status(200).json(searchVideo);
  } catch (err) {
    next(err);
  }
};

export const channelVideos = async (req, res, next) => {
  try {
    const videos = await Videos.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    if (!videos) return next(createError(404, "video not found"));
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
