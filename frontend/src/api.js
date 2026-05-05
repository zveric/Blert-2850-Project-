export async function getReadings(limit = 10, livestock = null) {
    let url = `/api/readings/?limit=${limit}`
    
    if (livestock) {
        url += `&livestock=${livestock}`
    }
    
    const res = await fetch(url)
    const data = await res.json()

    if (data.alerts != null) {
        const alert = await fetch(data.alert)
        data["alert"] = alert

        console.log(data)
    }
    return data
}