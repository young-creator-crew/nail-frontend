import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import { loginUser, registerUser } from "./authApi"

describe("auth API", () => {
  it("uses generic POST communication for login and registration", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({})

    await registerUser({ name: "Ana" })
    await loginUser({ identification: "ana" })

    expect(postSpy).toHaveBeenNthCalledWith(1, "/auth/register", { name: "Ana" }, {})
    expect(postSpy).toHaveBeenNthCalledWith(2, "/auth/login", { identification: "ana" }, {})
  })
})
