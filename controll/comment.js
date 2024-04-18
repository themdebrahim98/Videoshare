import mongoose from "mongoose";
import { createError } from "../error.js";
import Comment from "../model/Comment.js";
import Videos from "../model/Videos.js";

export const createComment = async (req, res, next) => {
  try {
    const comment = new Comment({
      userId: req.user.id,
      ...req.body,
    });
    const saveComment = await comment.save();

    res.status(200).json(saveComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Videos.findById(req.params.id);

    if (comment.userId === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("succsesfully deleted comment.");
    } else {
      next(createError(401, "you can delete only your comment"));
    }
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = new Comment({
      userId: req.user.id,
      ...req.body,
    });
    const saveComment = await comment.save();

    res.status(200).json(saveComment);
  } catch (error) {
    next(error);
  }
};

export const getcomment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
