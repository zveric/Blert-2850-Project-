import Navbar from '../components/navbar'

function Analysis() {
    return (
        <>

            <main style={{ padding: '2rem' }}>
                <h1>Analysis</h1>
                <p>This is the analysis page.</p>
                    <AlertBtn />
                    <LineChart/>
            </main>
        </>
    )
}

export default Analysis