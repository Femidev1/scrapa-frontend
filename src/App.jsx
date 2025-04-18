import { useEffect, useState } from 'react';

function App() {
  const [listings, setListings] = useState([]);
  const [lastListingUrl, setLastListingUrl] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const fetchListings = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.error("❌ VITE_API_BASE_URL is not set.");
      return;
    }

    fetch(`${baseUrl}/listings?nocache=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json();
      })
      .then(data => {
        console.log("🧪 Fetched Listings:", data);

        // 🔔 If a new listing is detected
        if (notificationsEnabled && lastListingUrl && data.length > 0 && data[0].url !== lastListingUrl) {
          new Notification("🚨 New Motorcycle Listing!", {
            body: data[0].title,
            icon: data[0].image || undefined,
          });
        }

        setListings(data);
        if (data.length > 0) setLastListingUrl(data[0].url);
      })
      .catch(err => console.error("❌ Fetch error:", err));
  };

  useEffect(() => {
    fetchListings();
    const interval = setInterval(fetchListings, 10000);
    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          console.log("🔔 Notifications enabled.");
        } else {
          console.log("🔕 Notifications denied.");
        }
      });
    } else if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem' }}>Live Motorcycle Listings</h1>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <button
          onClick={requestNotificationPermission}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔔 Enable Notifications
        </button>
      </div>

      {listings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No listings found.</p>
      ) : (
        listings.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h2>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            )}
            <p style={{ margin: '0.5rem 0', color: '#666' }}>
              <strong>Posted:</strong> {new Date(item.timestamp).toLocaleString()}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                textDecoration: 'none',
                color: '#fff',
                background: '#007bff',
                padding: '0.5rem 1rem',
                borderRadius: '5px'
              }}
            >
              View on Kijiji
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default App;