import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userRepository.find({
      order: { id: "ASC" },
    });

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
