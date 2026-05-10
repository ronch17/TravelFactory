import { NextFunction, Request, Response } from "express";
import { REQUEST_STATUSES } from "../config/constants";
import type { RequestStatus } from "../config/constants";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { VacationRequest } from "../entity/VacationRequest";

const userRepository = AppDataSource.getRepository(User);
const vacationRequestRepository = AppDataSource.getRepository(VacationRequest);

const isValidStatus = (value: unknown): value is RequestStatus =>
  typeof value === "string" &&
  (REQUEST_STATUSES as readonly RequestStatus[]).includes(
    value as RequestStatus,
  );

export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;
    const parsedUserId = Number(userId);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return res
        .status(400)
        .json({ message: "userId must be a positive integer" });
    }

    if (typeof startDate !== "string" || typeof endDate !== "string") {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ message: "startDate must be before endDate" });
    }

    const user = await userRepository.findOneBy({ id: parsedUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = vacationRequestRepository.create({
      userId: parsedUserId,
      startDate,
      endDate,
      reason: typeof reason === "string" ? reason : null,
      status: "Pending",
      comments: null,
    });

    const savedRequest = await vacationRequestRepository.save(request);

    return res.status(201).json(savedRequest);
  } catch (error) {
    return next(error);
  }
};

export const getRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let userId: number | undefined;

    if (req.query.userId !== undefined) {
      const parsedUserId = Number(req.query.userId);

      if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        return res
          .status(400)
          .json({ message: "userId must be a positive integer" });
      }

      userId = parsedUserId;
    }

    const status = req.query.status;
    if (status !== undefined && !isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const whereClause: { userId?: number; status?: RequestStatus } = {};
    if (userId !== undefined) {
      whereClause.userId = userId;
    }
    if (status !== undefined) {
      whereClause.status = status;
    }

    const requests = await vacationRequestRepository.find({
      where: whereClause,
      order: { createdAt: "DESC" },
    });

    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
};

export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requestId = Number(req.params.requestId);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return res
        .status(400)
        .json({ message: "requestId must be a positive integer" });
    }

    const status = req.body.status;

    if (!isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const request = await vacationRequestRepository.findOneBy({
      id: requestId,
    });

    if (!request) {
      return res.status(404).json({ message: "Vacation request not found" });
    }

    request.status = status;
    request.comments =
      typeof req.body.comments === "string" ? req.body.comments : null;

    if (status === "Rejected" && typeof req.body.comments !== "string") {
      return res.status(400).json({
        message: "comments are required when rejecting a request",
      });
    }

    const updatedRequest = await vacationRequestRepository.save(request);

    return res.status(200).json(updatedRequest);
  } catch (error) {
    return next(error);
  }
};
