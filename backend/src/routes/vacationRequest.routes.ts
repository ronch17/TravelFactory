import { Router } from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/vacationRequest.controller";

const router = Router();

router.post("/", createRequest);

router.get("/", getRequests);

router.patch("/:requestId/status", updateRequestStatus);

export default router;
