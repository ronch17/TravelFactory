import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMock } = vi.hoisted(() => ({
  findMock: vi.fn(),
}));

vi.mock("../src/config/data-source", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: findMock,
    }),
  },
}));

vi.mock("../src/entity/User", () => ({
  User: class User {},
}));

import { getUsers } from "../src/controllers/user.controller";

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

describe("user.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns users list with success message", async () => {
    const users = [
      { id: 1, name: "Dana", role: "Requester" },
      { id: 2, name: "Maya", role: "Validator" },
    ];
    findMock.mockResolvedValue(users);

    const req = {} as any;
    const res = createMockResponse();
    const next = vi.fn();

    await getUsers(req, res as any, next);

    expect(findMock).toHaveBeenCalledWith({
      order: { id: "ASC" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Users fetched successfully",
      data: users,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards repository errors to next middleware", async () => {
    const repositoryError = new Error("DB error");
    findMock.mockRejectedValue(repositoryError);

    const req = {} as any;
    const res = createMockResponse();
    const next = vi.fn();

    await getUsers(req, res as any, next);

    expect(next).toHaveBeenCalledWith(repositoryError);
  });
});
