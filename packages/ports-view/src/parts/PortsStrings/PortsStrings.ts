import * as I18nString from '../I18NString/I18NString.ts'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const add = (): string => {
  return I18nString.i18nString(UiStrings.Add)
}

export const addPort = (): string => {
  return I18nString.i18nString(UiStrings.AddPort)
}

export const cancel = (): string => {
  return I18nString.i18nString(UiStrings.Cancel)
}

export const enterAPortNumberBetween1And65535 = (): string => {
  return I18nString.i18nString(UiStrings.EnterAPortNumberBetween1And65535)
}

export const forwardedAddress = (): string => {
  return I18nString.i18nString(UiStrings.ForwardedAddress)
}

export const noForwardedPorts = (): string => {
  return I18nString.i18nString(UiStrings.NoForwardedPorts)
}

export const origin = (): string => {
  return I18nString.i18nString(UiStrings.Origin)
}

export const port = (): string => {
  return I18nString.i18nString(UiStrings.Port)
}

export const portIsActive = (port: number): string => {
  return I18nString.i18nString(UiStrings.PortIsActive, {
    PH1: String(port),
  })
}

export const portIsInactive = (port: number): string => {
  return I18nString.i18nString(UiStrings.PortIsInactive, {
    PH1: String(port),
  })
}

export const portNumber = (): string => {
  return I18nString.i18nString(UiStrings.PortNumber)
}

export const ports = (): string => {
  return I18nString.i18nString(UiStrings.Ports)
}

export const runningProcess = (): string => {
  return I18nString.i18nString(UiStrings.RunningProcess)
}

export const userForwarded = (): string => {
  return I18nString.i18nString(UiStrings.UserForwarded)
}
