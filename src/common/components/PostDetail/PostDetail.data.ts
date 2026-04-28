import { posts } from "@/common/components/ContentCards/PostsMockData"
import { PostDetailData } from "./PostDetail.types"

const commentTemplates = [
  {
    avatar: "AR",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi sit mauris, odio imperdiet.",
    time: "2 hours ago",
    username: "Alex Rivera",
  },
  {
    avatar: "SK",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis arcu nibh id augue.",
    time: "3 hours ago",
    username: "Sophie Kim",
  },
  {
    avatar: "JT",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas sem ut sit viverra amet.",
    time: "5 hours ago",
    username: "Jordan Tate",
  },
  {
    avatar: "LM",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer faucibus nibh quis auctor.",
    time: "1 day ago",
    username: "Leah Moore",
  },
]

const likesByPostId: Record<number, number> = {
  1: 2243,
  2: 1847,
  3: 2512,
  4: 1964,
}

const createdAtByPostId: Record<number, string> = {
  1: "July 3, 2021",
  2: "July 9, 2021",
  3: "July 14, 2021",
  4: "July 21, 2021",
}

const getGradientStops = (background: string) => {
  const matches = background.match(/#(?:[0-9a-fA-F]{3,8})/g)

  if (!matches || matches.length < 2) {
    return {
      end: "#111111",
      start: "#397df6",
    }
  }

  return {
    end: matches[matches.length - 1],
    start: matches[0],
  }
}

const createGradientImage = (background: string, label: string) => {
  const { end, start } = getGradientStops(background)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
        <linearGradient id="overlay" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#bg)" />
      <rect width="1200" height="1200" fill="url(#overlay)" />
      <text x="72" y="1090" fill="white" font-family="Arial, sans-serif" font-size="68" font-weight="700">
        ${label}
      </text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const getPostDetailById = (id: number): PostDetailData | undefined => {
  const post = posts.find((item) => item.id === id)

  if (!post) {
    return undefined
  }

  return {
    author: {
      avatar: post.avatar,
      username: post.username,
    },
    comments: commentTemplates.map((comment, index) => ({
      ...comment,
      id: id * 10 + index,
    })),
    createdAt: createdAtByPostId[id] ?? "July 3, 2021",
    description: post.description,
    id: post.id,
    images: post.images.map((image, index) => ({
      id: `${post.id}-${index}`,
      label: image.label,
      src: createGradientImage(image.background, image.label),
    })),
    likes: likesByPostId[id] ?? 2243,
  }
}
