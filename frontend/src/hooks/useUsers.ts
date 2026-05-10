import axios from "axios";
import { useEffect, useState } from "react";
import { mainRoute } from "../lib/MainRoute";

type User = {
  id: number;
  name: string;
  role: string;
};

type UsersResponse = User[] | { data?: User[] };

function normalizeUsers(payload: UsersResponse): User[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true);
        const response = await mainRoute.get("/users");
        setUsers(normalizeUsers(response.data as UsersResponse));
        setError("");
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError)) {
          setError(
            (requestError.response?.data as { message?: string } | undefined)
              ?.message ?? "Failed loading users",
          );
          return;
        }

        setError(
          "Failed loading users",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}
