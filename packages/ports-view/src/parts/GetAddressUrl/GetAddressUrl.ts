const SchemeRegex = /^[a-z][a-z\d+.-]*:\/\//i

export const getAddressUrl = (address: string): string => {
  return SchemeRegex.test(address) ? address : `http://${address}`
}
