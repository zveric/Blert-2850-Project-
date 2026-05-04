export async function getReadings(limit = 10, livestock = null) {
    let url = `/api/readings/?limit=${limit}`
    
    if (livestock) {
        url += `&livestock=${livestock}`
    }
    
    const res = await fetch(url)
    const data = await res.json()
    return data
}