import { describe, expect, test } from "vitest";

import { authReducer, setIsLoggedIn } from "@/features/auth/model/authSlice";

describe("authSlice", () => {
  test("should update authentication status", () => {
    const state = authReducer(undefined, setIsLoggedIn(true));

    expect(state.isLoggedIn).toBe(true);
  });
});
