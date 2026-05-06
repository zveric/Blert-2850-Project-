export async function getReadings(limit = 10, livestock = null, startDate = null, endDate = null)  {
    let url = `/api/readings/?limit=${limit}`
    
    if (livestock) {
        url += `&livestock=${livestock}`
    }
    
    if (startDate) {
        url += `&start_date=${startDate.toISOString()}`
    }
    if (endDate) {
        url += `&end_date=${endDate.toISOString()}`
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