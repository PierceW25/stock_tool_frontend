export function formatDate(date: string) {
    let newDate = date.split('T')[0] + ' ' + date.split('T')[1]
    let finalDate = new Date(
        Number(newDate.substring(0, 4)),
        Number(newDate.substring(4, 6)) - 1, 
        Number(newDate.substring(6, 8)), 
        Number(newDate.substring(9, 11)), 
        Number(newDate.substring(11, 13)), 
        Number(newDate.substring(13, 15))
        )
    return finalDate
}