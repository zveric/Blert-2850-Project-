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
        <button 
            className="btn btn-dark" 
            onClick={handleDownload}
            onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#353535';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(57,57,57,0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#444444';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(57,57,57,0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: '3px solid #2b2b2b',
                backgroundColor: '#444444',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(57,57,57,0.3)',
                transition: 'background-color 0.15s, box-shadow 0.15s, transform 0.15s',
                flexShrink: 0,
            }}
            title="Download CSV"
            aria-label="Download CSV"
        >    
            Download CSV
        </button>
    )
}

export default DownloadCSV