import { useEffect, useState } from 'react'

const handleChangeInterval = async (minutes) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_interval: minutes * 60 }),
    });
    const data = await response.json();
    console.log("✅ Updated interval:", data);
  } catch (err) {
    console.error("❌ Failed to update refresh interval", err);
  }
};

function App() {
  const [listings, setListings] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    if (!baseUrl) {
      console.error("❌ VITE_API_BASE_URL is not set.")
      return
    }

    console.log("🌐 Fetching from:", `${baseUrl}/listings`)

    fetch(`${baseUrl}/listings`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings")
        return res.json()
      })
      .then(data => setListings(data))
      .catch(err => console.error('Error loading listings:', err))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Live Kijiji Listings</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <strong>⏱ Set Refresh Interval: </strong>
        <button onClick={() => handleChangeInterval(5)} style={{ margin: "0 5px" }}>5 mins</button>
        <button onClick={() => handleChangeInterval(10)} style={{ margin: "0 5px" }}>10 mins</button>
        <button onClick={() => handleChangeInterval(30)} style={{ margin: "0 5px" }}>30 mins</button>
      </div>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        listings.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px'
            }}
          >
            <h2>{item.title}</h2>

            {item.image && item.image !== "" && (
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
            )}

            <p><strong>Posted:</strong> {new Date(item.timestamp).toLocaleString()}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">View Listing</a>
          </div>
        ))
      )}
    </div>
  )
}

export default App