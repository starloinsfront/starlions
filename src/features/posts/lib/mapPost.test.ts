import { describe, expect, it } from "vitest"

import { mapPostDtoToPublicPost } from "./mapPost"

const basePost = {
  id: "post-id",
  createdAt: "2026-09-27T12:00:00.000Z",
  description: "Post",
  images: [],
}

describe("mapPostDtoToPublicPost", () => {
  it("maps the author avatar returned by the API", () => {
    const post = mapPostDtoToPublicPost({
      ...basePost,
      author: {
        authorId: "author-id",
        avatarUrl: "https://cdn.example.com/avatar.jpg",
        username: "author",
      },
    })

    expect(post?.author.avatarUrl).toBe("https://cdn.example.com/avatar.jpg")
  })

  it.each([null, undefined, {}, "   "])(
    "uses the fallback for an invalid avatar: %p",
    (avatarUrl) => {
      const post = mapPostDtoToPublicPost({
        ...basePost,
        author: {
          authorId: "author-id",
          avatarUrl,
          username: "author",
        },
      })

      expect(post?.author.avatarUrl).toBeNull()
    },
  )
})
