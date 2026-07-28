export interface Port {
  readonly active: boolean
  readonly forwardedAddress: string
  readonly origin: string
  readonly port: number
  readonly runningProcess: string
}
