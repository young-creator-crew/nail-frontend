import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import { loginUser, registerUser } from "./authApi"

describe("auth API", () => {
  it("uses generic POST communication for login and registration", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({})

    await registerUser({ name: "Ana", email: "ana@email.com", password: "Senha123!" })
    await loginUser({ email: "ana@email.com", password: "Senha123!" })

    expect(postSpy).toHaveBeenNthCalledWith(1, "/auth/register", { name: "Ana", email: "ana@email.com", password: "Senha123!" }, {})
    expect(postSpy).toHaveBeenNthCalledWith(2, "/auth/login", { email: "ana@email.com", password: "Senha123!" }, {})
  })
})
