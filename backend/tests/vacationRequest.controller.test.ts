import { beforeEach, describe, expect, it, vi } from "vitest";

const { userRepository, vacationRequestRepository } = vi.hoisted(() => ({
  userRepository: {
    findOneBy: vi.fn(),
  },
  vacationRequestRepository: {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
  },
}));

vi.mock("../src/config/data-source", () => ({
  AppDataSource: {
    getRepository: vi
      .fn()
      .mockReturnValueOnce(userRepository)
      .mockReturnValueOnce(vacationRequestRepository),
  },
}));

vi.mock("../src/entity/User", () => ({
  User: class User {},
}));

vi.mock("../src/entity/VacationRequest", () => ({
  VacationRequest: class VacationRequest {},
}));

import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../src/controllers/vacationRequest.controller";

type MockResponse = {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

const createMockResponse = (): MockResponse => {
  const response: MockResponse = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
};

describe("vacationRequest.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when createRequest gets invalid userId", async () => {
    const req = {
      body: {
        userId: "abc",
        startDate: "2026-01-01",
        endDate: "2026-01-02",
      },
    } as any;
    const res = createMockResponse();
    const next = vi.fn();

    await createRequest(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "userId must be a positive integer",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("creates request and returns 201", async () => {
    userRepository.findOneBy.mockResolvedValue({
      id: 1,
      name: "Dana",
      role: "Requester",
    });
    vacationRequestRepository.create.mockImplementation((payload) => payload);
    vacationRequestRepository.save.mockResolvedValue({
      id: 123,
      userId: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      reason: null,
      status: "Pending",
      comments: null,
    });

    const req = {
      body: {
        userId: 1,
        startDate: "2026-01-01",
        endDate: "2026-01-02",
      },
    } as any;
    const res = createMockResponse();
    const next = vi.fn();

    await createRequest(req, res as any, next);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(vacationRequestRepository.create).toHaveBeenCalledWith({
      userId: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      reason: null,
      status: "Pending",
      comments: null,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when getRequests receives invalid status filter", async () => {
    const req = {
      query: {
        status: "UnknownStatus",
      },
    } as any;
    const res = createMockResponse();
    const next = vi.fn();

    await getRequests(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid request status",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when rejecting request without comments", async () => {
    vacationRequestRepository.findOneBy.mockResolvedValue({
      id: 5,
      status: "Pending",
      comments: null,
    });

    const req = {
      params: { requestId: "5" },
      body: { status: "Rejected" },
    } as any;
    const res = createMockResponse();
    const next = vi.fn();

    await updateRequestStatus(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "comments are required when rejecting a request",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
