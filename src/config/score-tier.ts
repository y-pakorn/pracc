export const scoreTier = [
  {
    tier: "S",
    gt: 10.9,
    color: "#FFD700",
    emoji: "🥇",
  },
  {
    tier: "A",
    gt: 8.9,
    color: "#C0C0C0",
    emoji: "🥈",
  },
  {
    tier: "B",
    gt: 6.9,
    color: "#CD7F32",
    emoji: "🥉",
  },
  {
    tier: "C",
    gt: 4.9,
    color: "#808080",
  },
  {
    tier: "D",
    gt: 0.1,
    color: "#707070",
  },
  {
    tier: "N/A",
    gt: -1,
    color: "#606060",
  },
] as {
  tier: string
  gt: number
  color: string
  emoji?: string
}[]
