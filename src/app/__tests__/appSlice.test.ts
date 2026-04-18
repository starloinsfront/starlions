import { describe, expect, test } from "vitest";

import { appReducer, setIsInitialized } from "@/app/appSlice";

describe("appSlice", () => {
  test("should set initialization flag", () => {
    const state = appReducer(undefined, setIsInitialized(true));

    expect(state.isInitialized).toBe(true);
  });
});
