export const phoneNumberFormatter = (phone) => {
  if (phone) {
    phone = phone.replace(/[^\d]/g, '')
    const length = 10
    if (phone.length === length) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3')
    }
  }
  return null
}