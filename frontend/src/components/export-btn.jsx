import { getToken } from '../api'

function DownloadCSV() {

    const handleDownload = () => {
        fetch('/api/csv/', {
            headers: { 'Authorization': `Token ${getToken()}` }
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'livestock_tracking.csv'
            a.click()
        })
    }

    return (
        <button className="btn btn-dark" onClick={handleDownload}>Download CSV</button>
    )
}

export default DownloadCSV