import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue with Vite/webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapView({ properties = [], center = [20.5937, 78.9629], zoom = 5, single = false }) {
  const validProperties = properties.filter(p => p.location?.lat && p.location?.lng)

  const mapCenter = single && validProperties.length > 0
    ? [validProperties[0].location.lat, validProperties[0].location.lng]
    : center

  return (
    <MapContainer
      center={mapCenter}
      zoom={single ? 14 : zoom}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validProperties.map(p => (
        <Marker key={p._id} position={[p.location.lat, p.location.lng]}>
          <Popup>
            <div className="text-sm min-w-40">
              {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-24 object-cover rounded mb-2"/>}
              <p className="font-semibold text-gray-800">{p.title}</p>
              <p className="text-blue-600 font-bold">Rs. {p.price?.toLocaleString()}/mo</p>
              <p className="text-gray-500 text-xs capitalize">{p.type} &bull; {p.address?.city}</p>
              {!single && (
                <Link to={`/properties/${p._id}`} className="block mt-2 text-center bg-blue-600 text-white text-xs py-1 rounded-lg hover:bg-blue-700">
                  View Details
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
