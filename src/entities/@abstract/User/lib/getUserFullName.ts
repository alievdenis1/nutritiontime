export const getUserFullName = (firstname: string, lastname: string, surname: string | null) => {
    let fullName = lastname ? `${lastname} ` : ''
    fullName += firstname ? `${firstname} ` : ''
    fullName += surname || ''

    return fullName.trim()
}