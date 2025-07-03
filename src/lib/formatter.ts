import numbro from "numbro"

import { dayjs } from "@/lib/dayjs"

export const formatter = Object.freeze({
  number: (value: number | string, options?: { mantissa?: number }) => {
    return numbro(value).format({
      mantissa: options?.mantissa ?? 2,
      thousandSeparated: true,
      trimMantissa: true,
      optionalMantissa: true,
    })
  },
  numberReadable: (value: number | string, options?: { mantissa?: number }) => {
    return numbro(value).format({
      mantissa: options?.mantissa ?? 2,
      average: true,
      thousandSeparated: true,
      trimMantissa: true,
      optionalMantissa: true,
      lowPrecision: false,
    })
  },
  pct: (value: number | string, options?: { mantissa?: number }) => {
    return numbro(value).format({
      mantissa: options?.mantissa ?? 2,
      output: "percent",
      average: true,
      thousandSeparated: true,
    })
  },
  month: (value: number | string) => {
    return dayjs(value).format("MM/YYYY")
  },
})
