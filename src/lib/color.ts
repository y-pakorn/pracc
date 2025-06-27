import { cache } from "react"
import Color from "color"
import uniqolor from "uniqolor"

export const getColor = cache((value: string) => {
  const color = uniqolor(`${value}.`, {
    lightness: 60,
    saturation: 60,
  }).color
  return Color(color)
})
