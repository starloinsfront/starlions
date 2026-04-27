import { Post } from "@/common/components/ContentCards/PostImageType"

export const posts: Post[] = [
  {
    id: 1,
    username: "Olivia Mason",
    avatar: "OM",
    time: "22 min ago",
    description:
      "Golden hour frames, quiet coffee corners and a slow morning in a city that never really sleeps. I spent the first hour just watching how the light moved across the rooftops and changed every surface. Some streets felt loud and cinematic, while others were calm enough to hear cups touch saucers from across the terrace. I kept saving tiny moments that would normally disappear before anyone noticed them. This is the kind of morning I always want to remember in full detail.",
    images: [
      { label: "Lisbon Rooftop", background: "linear-gradient(135deg, #615fff 0%, #1d1d1d 100%)" },
      { label: "Studio Notes", background: "linear-gradient(135deg, #397df6 0%, #0d0d0d 100%)" },
      { label: "Midnight Feed", background: "linear-gradient(135deg, #3e3e3e 0%, #111 100%)" },
    ],
  },
  {
    id: 2,
    username: "Daniel Reed",
    avatar: "DR",
    time: "1 hour ago",
    description:
      "A sharper profile card, a cleaner onboarding and the kind of contrast that keeps a dark UI feeling premium. We cut several decorative elements that looked impressive in isolation but slowed the first scan of the screen. The new layout gives more space to names, key actions and status indicators without feeling empty. I also reworked the spacing system so the card feels more deliberate on both desktop and mobile. It is a small update visually, but the whole product now reads faster.",
    images: [
      { label: "Design Review", background: "linear-gradient(135deg, #0f1729 0%, #397df6 100%)" },
      { label: "UI Sprint", background: "linear-gradient(135deg, #332f55 0%, #090909 100%)" },
    ],
  },
  {
    id: 3,
    username: "Ava Brooks",
    avatar: "AB",
    time: "3 hours ago",
    description:
      "Testing carousel motion and content density on smaller screens before the next batch of creators joins. The biggest issue was not animation speed, but how quickly stacked content started competing for attention. I trimmed a few secondary labels, adjusted rhythm between blocks and slowed the transition just enough to feel intentional. The result is easier to read with one hand and still feels expressive instead of stripped down. I want the final version to feel stable even when the content gets noisy.",
    images: [
      { label: "Night Motion", background: "linear-gradient(135deg, #111827 0%, #5b21b6 100%)" },
      { label: "Creator Mode", background: "linear-gradient(135deg, #0d0d0d 0%, #1d4ed8 100%)" },
      { label: "Preview Pass", background: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
    ],
  },
  {
    id: 4,
    username: "Ethan Cole",
    avatar: "EC",
    time: "5 hours ago",
    description:
      "Shipping another polished card layout with stronger hierarchy, tighter spacing and a calmer reading rhythm. I focused on making the first screen useful before asking the user to interact with anything. The image still leads, but the metadata now supports it instead of fighting for the same attention. When the description expands, the card keeps its structure and does not feel like it is breaking apart. That balance between motion, hierarchy and readability is what makes the component feel finished.",
    images: [
      { label: "Product Pulse", background: "linear-gradient(135deg, #397df6 0%, #56ccf2 100%)" },
      { label: "Evening Mode", background: "linear-gradient(135deg, #141e30 0%, #243b55 100%)" },
    ],
  },
]
