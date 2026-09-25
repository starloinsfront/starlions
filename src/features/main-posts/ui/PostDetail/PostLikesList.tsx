import clsx from "clsx"

import { Icon } from "@/common/components/Icon/Icon"
import { PostAvatar } from "./PostAvatar"
import s from "./PostLikesList.module.css"
import type { PostDetailLike } from "./PostDetail.types"

type Props = {
  className?: string
  isAuthorized?: boolean
  likes: PostDetailLike[]
  variant?: "desktop" | "mobile"
}

export const PostLikesList = ({ className, isAuthorized = true, likes, variant = "desktop" }: Props) => {
  return (
    <div className={clsx(s.root, variant === "mobile" && s.mobile, className)}>
      <label className={s.search}>
        <Icon className={s.searchIcon} height={20} name="searchOutline" width={20} />
        <input aria-label="Search users" placeholder="Search" type="search" />
      </label>

      <ul className={s.list}>
        {likes.map((like) => (
          <li className={s.item} key={like.id}>
            <div className={s.userInfo}>
              <PostAvatar label={like.avatarLabel} size="md" />
              <span className={s.username}>{like.username}</span>
            </div>

            {isAuthorized && (
              <button
                className={clsx(s.followButton, like.isFollowing && s.followButtonSecondary)}
                type="button"
              >
                {like.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
