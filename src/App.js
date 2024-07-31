import React, {useState, createContext, useContext} from 'react'
import './App.css'
import {useFormik} from 'formik'
import * as Yup from 'yup'

const BookingContext = createContext()

const propertiesData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    title: 'Beautiful House',
    description: 'A lovely house with a great view.',
    price: 200,
    location: 'New York',
    bedrooms: 3,
    amenities: ['WiFi', 'Pool'],
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    title: 'Cozy Apartment',
    description: 'A small, cozy apartment.',
    price: 100,
    location: 'San Francisco',
    bedrooms: 2,
    amenities: ['WiFi'],
  },
]

const PropertyCard = ({property, addBooking}) => (
  <div className="property-card">
    <img src={property.image} alt={property.title} />
    <h3>{property.title}</h3>
    <p>{property.description}</p>
    <p>Price: ${property.price}</p>
    <button onClick={() => addBooking(property)}>Book Now</button>
  </div>
)

const PropertyList = () => {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    bedrooms: '',
    amenities: '',
  })
  const {addBooking} = useContext(BookingContext)

  const handleFilterChange = e => {
    setFilters({...filters, [e.target.name]: e.target.value})
  }

  const filteredProperties = propertiesData.filter(
    property =>
      (filters.location
        ? property.location.includes(filters.location)
        : true) &&
      (filters.priceRange ? property.price <= filters.priceRange : true) &&
      (filters.bedrooms
        ? property.bedrooms === parseInt(filters.bedrooms)
        : true) &&
      (filters.amenities
        ? property.amenities.includes(filters.amenities)
        : true),
  )

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceRange"
          placeholder="Max Price"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="amenities"
          placeholder="Amenities"
          onChange={handleFilterChange}
        />
      </div>
      <div className="property-list">
        {filteredProperties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            addBooking={addBooking}
          />
        ))}
      </div>
    </div>
  )
}

const Cart = () => {
  const {bookings, removeBooking} = useContext(BookingContext)
  const total = bookings.reduce((sum, booking) => sum + booking.price, 0)

  return (
    <div>
      <h2>Cart</h2>
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.title}</h3>
          <p>Price: ${booking.price}</p>
          <button onClick={() => removeBooking(booking.id)}>Remove</button>
        </div>
      ))}
      <div>Total: ${total}</div>
    </div>
  )
}

const Checkout = () => {
  const formik = useFormik({
    initialValues: {name: '', email: '', paymentDetails: ''},
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      paymentDetails: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      console.log('Form values:', values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name ? <div>{formik.errors.name}</div> : null}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
      </div>
      <div>
        <label htmlFor="paymentDetails">Payment Details</label>
        <input
          id="paymentDetails"
          type="text"
          name="paymentDetails"
          onChange={formik.handleChange}
          value={formik.values.paymentDetails}
        />
        {formik.errors.paymentDetails ? (
          <div>{formik.errors.paymentDetails}</div>
        ) : null}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

const BookingProvider = ({children}) => {
  const [bookings, setBookings] = useState([])

  const addBooking = property => {
    setBookings([...bookings, property])
  }

  const removeBooking = propertyId => {
    setBookings(bookings.filter(b => b.id !== propertyId))
  }

  return (
    <BookingContext.Provider value={{bookings, addBooking, removeBooking}}>
      {children}
    </BookingContext.Provider>
  )
}

const App = () => (
  <BookingProvider>
    <div className="App">
      <h1>Property Rental Platform</h1>
      <PropertyList />
      <Cart />
      <Checkout />
    </div>
  </BookingProvider>
)

export default App
