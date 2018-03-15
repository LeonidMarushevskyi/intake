export const phoneNumberFormatter = (phone) => {
  if (phone) {
    phone = phone.replace(/[^\d]/g, '')
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3')
    }
  }
return null
}