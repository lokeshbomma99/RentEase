import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const translations = {
  en: {
    // Navbar
    home: 'Home', login: 'Login', register: 'Register', logout: 'Logout',
    myBookings: 'My Bookings', dashboard: 'Dashboard', properties: 'Properties',
    bookings: 'Bookings', users: 'Users', addProperty: 'Add Property',
    profile: 'Profile', wishlist: 'Wishlist', settings: 'Settings',
    // Home page
    // Extra keys
    email: 'Email', password: 'Password', name: 'Name', role: 'Role',
    status: 'Status', action: 'Action', noReviewsYet: 'No reviews yet',
    noBookingsYet: 'No bookings yet', confirmReject: 'Confirm Reject',
    createAccount: 'Create your account', alreadyHaveAccount: 'Already have an account?',
    iAmA: 'I am a...', tenant: 'Tenant (Looking for rent)', owner_role: 'Owner (I have properties)',
    noImg: 'No Image', pendingApproval: 'Pending Approval', noPendingProperties: 'No pending properties 🎉',
    deactivate: 'Deactivate', activate: 'Activate', inactive: 'Inactive',
    findHome: 'Find Your Perfect Home',
    browseProperties: 'Browse thousands of rental properties across India',
    search: 'Search', allTypes: 'All Types', minPrice: 'Min Rs.', maxPrice: 'Max Rs.',
    filters: 'Filters', clearAll: 'Clear all', furnished: 'Furnished',
    parking: 'Parking', petFriendly: 'Pet Friendly', found: 'found',
    noProperties: 'No properties found. Try different filters.',
    clearFilters: 'Clear filters', grid: 'Grid', map: 'Map',
    // Property card
    viewDetails: 'View Details', currentlyRented: 'Currently Rented',
    // Status
    available: 'Available', rented: 'Rented', pending: 'Pending',
    approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled',
    // Property detail
    sendBookingRequest: 'Send Booking Request', moveIn: 'Move-in Date',
    moveOut: 'Move-out Date', duration: 'Duration', months: 'month(s)',
    total: 'Total', ownerDetails: 'Owner Details', bookThisProperty: 'Book This Property',
    loginToBook: 'Login to book this property', locationOnMap: 'Location on Map',
    reviews: 'Reviews', submitReview: 'Submit Review', shareExperience: 'Share your experience...',
    noReviews: 'No reviews yet. Be the first!', amenities: 'Amenities',
    beds: 'Beds', baths: 'Baths', rating: 'Rating', messageForOwner: 'Any message for owner...',
    // Bookings
    myBookingsTitle: 'My Bookings', noBookings: 'No bookings yet',
    downloadInvoice: 'Invoice', cancelBooking: 'Cancel',
    // Wishlist
    myWishlist: 'My Wishlist', noWishlist: 'No saved properties yet. Browse and save properties you like!',
    // Profile
    myProfile: 'My Profile', personalInfo: 'Personal Info', changePassword: 'Change Password',
    preferences: 'Preferences', saveChanges: 'Save Changes', fullName: 'Full Name',
    phone: 'Phone', emailCannotChange: 'Email (cannot change)', darkModeLabel: 'Dark Mode',
    darkModeDesc: 'Switch to dark theme', languageLabel: 'Language',
    currentPassword: 'Current Password', newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    // Owner
    ownerDashboard: 'Owner Dashboard', totalProperties: 'My Properties',
    totalBookings: 'Total Bookings', totalRevenue: 'Total Revenue', totalViews: 'Total Views',
    occupancy: 'Occupancy', monthlyBookings: 'Monthly Bookings (Last 6 Months)',
    monthlyRevenue: 'Monthly Revenue (Last 6 Months)', quickActions: 'Quick Actions',
    viewProperties: 'View Properties', manageBookings: 'Manage Bookings',
    editProperty: 'Edit Property', deleteProperty: 'Delete Property',
    addPropertyTitle: 'Add New Property', editPropertyTitle: 'Edit Property',
    propertyImages: 'Property Images', basicInfo: 'Basic Info', address: 'Address',
    mapLocation: 'Map Location', features: 'Features', submitForApproval: 'Submit for Approval',
    updateProperty: 'Update Property', uploading: 'Uploading...',
    // Admin
    adminDashboard: 'Admin Dashboard', manageUsers: 'Manage Users',
    approveProperties: 'Approve Properties', manageReviews: 'Manage Reviews',
    broadcastEmail: 'Broadcast Email', sendTo: 'Send To', allUsers: 'All Users',
    tenantsOnly: 'Tenants Only', ownersOnly: 'Owners Only', subject: 'Subject',
    message: 'Message', sendBroadcast: 'Send Broadcast Email', sending: 'Sending...',
    // Compare
    compareProperties: 'Compare Properties', selectAtLeast2: 'Select at least 2 properties to compare',
    searchProperty: 'Search property...', noResults: 'No results',
  },
  gu: {
    home: 'હોમ', login: 'લૉગિન', register: 'નોંધણી', logout: 'લૉગઆઉટ',
    myBookings: 'મારી બુકિંગ', dashboard: 'ડેશબોર્ડ', properties: 'મિલકતો',
    bookings: 'બુકિંગ', users: 'વપરાશકર્તા', addProperty: 'મિલકત ઉમેરો',
    profile: 'પ્રોફાઇલ', wishlist: 'ઇચ્છા સૂચિ', settings: 'સેટિંગ્સ',
    // Extra keys
    email: 'ઈમેઇલ', password: 'પાસવર્ડ', name: 'નામ', role: 'ભૂમિકા',
    status: 'સ્થિતિ', action: 'ક્રિયા', noReviewsYet: 'હજુ કોઈ સમીક્ષા નથી',
    noBookingsYet: 'હજુ કોઈ બુકિંગ નથી', confirmReject: 'નામંજૂર ખાતરી',
    createAccount: 'ખાતું બનાવો', alreadyHaveAccount: 'પહેલેથી ખાતું છે?',
    iAmA: 'હું છું...', tenant: 'ભાડૂત (ભાડે શોધી રહ્યો છું)', owner_role: 'માલિક (મારી પાસે મિલકત છે)',
    noImg: 'કોઈ છબી નથી', pendingApproval: 'મંજૂરી બાકી', noPendingProperties: 'કોઈ બાકી મિલકત નથી 🎉',
    deactivate: 'નિષ્ક્રિય', activate: 'સક્રિય', inactive: 'નિષ્ક્રિય',
    findHome: 'તમારું સ્વપ્ન ઘર શોધો',
    browseProperties: 'ભારત ભરમાં હજારો ભાડાની મિલકતો બ્રાઉઝ કરો',
    search: 'શોધો', allTypes: 'બધા પ્રકાર', minPrice: 'ઓછી કિંમત', maxPrice: 'વધુ કિંમત',
    filters: 'ફિલ્ટર', clearAll: 'બધા સાફ', furnished: 'ફર્નિચર સાથે',
    parking: 'પાર્કિંગ', petFriendly: 'પ્રાણી માટે', found: 'મળ્યા',
    noProperties: 'કોઈ મિલકત મળી નથી. અલગ ફિલ્ટર અજમાવો.',
    clearFilters: 'ફિલ્ટર સાફ', grid: 'ગ્રીડ', map: 'નકશો',
    viewDetails: 'વિગતો જુઓ', currentlyRented: 'ભાડે આપ્યું',
    available: 'ઉપલબ્ધ', rented: 'ભાડે', pending: 'પ્રતીક્ષા',
    approved: 'મંજૂર', rejected: 'નામંજૂર', cancelled: 'રદ',
    sendBookingRequest: 'બુકિંગ વિનંતી મોકલો', moveIn: 'પ્રવેશ તારીખ',
    moveOut: 'પ્રસ્થાન તારીખ', duration: 'સમય', months: 'મહિના',
    total: 'કુલ', ownerDetails: 'માલિકની વિગતો', bookThisProperty: 'આ મિલકત બુક કરો',
    loginToBook: 'બુક કરવા લૉગિન કરો', locationOnMap: 'નકશા પર સ્થાન',
    reviews: 'સમીક્ષાઓ', submitReview: 'સમીક્ષા સબમિટ', shareExperience: 'તમારો અનુભવ શેર કરો...',
    noReviews: 'હજુ સુધી કોઈ સમીક્ષા નથી.', amenities: 'સુવિધાઓ',
    beds: 'બેડ', baths: 'બાથ', rating: 'રેટિંગ', messageForOwner: 'માલિક માટે સંદેશ...',
    myBookingsTitle: 'મારી બુકિંગ', noBookings: 'હજુ કોઈ બુકિંગ નથી',
    downloadInvoice: 'ઇન્વૉઇસ', cancelBooking: 'રદ',
    myWishlist: 'મારી ઇચ્છા સૂચિ', noWishlist: 'કોઈ સાચવેલ મિલકત નથી.',
    myProfile: 'મારી પ્રોફાઇલ', personalInfo: 'વ્યક્તિગત માહિતી',
    changePassword: 'પાસવર્ડ બદલો', preferences: 'પ્રાધાન્યતા',
    saveChanges: 'ફેરફાર સાચવો', fullName: 'પૂરું નામ', phone: 'ફોન',
    emailCannotChange: 'ઈમેઇલ (બદલી શકાય નહીં)', darkModeLabel: 'ડાર્ક મોડ',
    darkModeDesc: 'ડાર્ક થીમ', languageLabel: 'ભાષા',
    currentPassword: 'વર્તમાન પાસવર્ડ', newPassword: 'નવો પાસવર્ડ',
    confirmPassword: 'નવો પાસવર્ડ ખાતરી',
    ownerDashboard: 'માલિક ડેશબોર્ડ', totalProperties: 'મારી મિલકતો',
    totalBookings: 'કુલ બુકિંગ', totalRevenue: 'કુલ આવક', totalViews: 'કુલ જોવાઈ',
    occupancy: 'ઓક્યુપન્સી', monthlyBookings: 'માસિક બુકિંગ',
    monthlyRevenue: 'માસિક આવક', quickActions: 'ઝડપી ક્રિયાઓ',
    viewProperties: 'મિલકતો જુઓ', manageBookings: 'બુકિંગ સંચાલન',
    editProperty: 'મિલકત સંપાદિત', deleteProperty: 'મિલકત કાઢો',
    addPropertyTitle: 'નવી મિલકત ઉમેરો', editPropertyTitle: 'મિલકત સંપાદિત',
    propertyImages: 'મિલકત છબીઓ', basicInfo: 'મૂળભૂત માહિતી',
    address: 'સરનામું', mapLocation: 'નકશા સ્થાન', features: 'લક્ષણો',
    submitForApproval: 'મંજૂરી માટે સબમિટ', updateProperty: 'મિલકત અપડેટ', uploading: 'અપલોડ...',
    adminDashboard: 'એડમિન ડેશબોર્ડ', manageUsers: 'વપરાશકર્તા સંચાલન',
    approveProperties: 'મિલકત મંજૂર', manageReviews: 'સમીક્ષા સંચાલન',
    broadcastEmail: 'બ્રોડકાસ્ટ ઈમેઇલ', sendTo: 'ને મોકલો', allUsers: 'બધા વપરાશકર્તા',
    tenantsOnly: 'ભાડૂત માત્ર', ownersOnly: 'માલિક માત્ર', subject: 'વિષય',
    message: 'સંદેશ', sendBroadcast: 'બ્રોડકાસ્ટ ઈમેઇલ મોકલો', sending: 'મોકલાઈ રહ્યું...',
    compareProperties: 'મિલકત સરખામણી', selectAtLeast2: 'સરખામણી માટે ઓછામાં ઓછી 2 મિલકત પસંદ કરો',
    searchProperty: 'મિલકત શોધો...', noResults: 'કોઈ પરિણામ નથી',
  },
  hi: {
    home: 'होम', login: 'लॉगिन', register: 'रजिस्टर', logout: 'लॉगआउट',
    myBookings: 'मेरी बुकिंग', dashboard: 'डैशबोर्ड', properties: 'संपत्तियां',
    bookings: 'बुकिंग', users: 'उपयोगकर्ता', addProperty: 'संपत्ति जोड़ें',
    profile: 'प्रोफाइल', wishlist: 'पसंद सूची', settings: 'सेटिंग्स',
    // Extra keys
    email: 'ईमेल', password: 'पासवर्ड', name: 'नाम', role: 'भूमिका',
    status: 'स्थिति', action: 'कार्य', noReviewsYet: 'अभी कोई समीक्षा नहीं',
    noBookingsYet: 'अभी कोई बुकिंग नहीं', confirmReject: 'अस्वीकृति पुष्टि',
    createAccount: 'खाता बनाएं', alreadyHaveAccount: 'पहले से खाता है?',
    iAmA: 'मैं हूं...', tenant: 'किरायेदार (किराए की तलाश)', owner_role: 'मालिक (मेरे पास संपत्ति है)',
    noImg: 'कोई छवि नहीं', pendingApproval: 'मंजूरी बाकी', noPendingProperties: 'कोई लंबित संपत्ति नहीं 🎉',
    deactivate: 'निष्क्रिय करें', activate: 'सक्रिय करें', inactive: 'निष्क्रिय',
    findHome: 'अपना सपनों का घर खोजें',
    browseProperties: 'पूरे भारत में हजारों किराये की संपत्तियां ब्राउज़ करें',
    search: 'खोजें', allTypes: 'सभी प्रकार', minPrice: 'न्यूनतम Rs.', maxPrice: 'अधिकतम Rs.',
    filters: 'फ़िल्टर', clearAll: 'सब हटाएं', furnished: 'सुसज्जित',
    parking: 'पार्किंग', petFriendly: 'पालतू अनुकूल', found: 'मिले',
    noProperties: 'कोई संपत्ति नहीं मिली। अलग फ़िल्टर आज़माएं।',
    clearFilters: 'फ़िल्टर हटाएं', grid: 'ग्रिड', map: 'नक्शा',
    viewDetails: 'विवरण देखें', currentlyRented: 'किराए पर है',
    available: 'उपलब्ध', rented: 'किराए पर', pending: 'लंबित',
    approved: 'मंजूर', rejected: 'अस्वीकृत', cancelled: 'रद्द',
    sendBookingRequest: 'बुकिंग अनुरोध भेजें', moveIn: 'प्रवेश तिथि',
    moveOut: 'प्रस्थान तिथि', duration: 'अवधि', months: 'महीने',
    total: 'कुल', ownerDetails: 'मालिक विवरण', bookThisProperty: 'यह संपत्ति बुक करें',
    loginToBook: 'बुक करने के लिए लॉगिन करें', locationOnMap: 'नक्शे पर स्थान',
    reviews: 'समीक्षाएं', submitReview: 'समीक्षा सबमिट', shareExperience: 'अपना अनुभव शेयर करें...',
    noReviews: 'अभी तक कोई समीक्षा नहीं।', amenities: 'सुविधाएं',
    beds: 'बेड', baths: 'बाथ', rating: 'रेटिंग', messageForOwner: 'मालिक के लिए संदेश...',
    myBookingsTitle: 'मेरी बुकिंग', noBookings: 'अभी कोई बुकिंग नहीं',
    downloadInvoice: 'इनवॉइस', cancelBooking: 'रद्द',
    myWishlist: 'मेरी पसंद सूची', noWishlist: 'कोई सहेजी संपत्ति नहीं।',
    myProfile: 'मेरी प्रोफाइल', personalInfo: 'व्यक्तिगत जानकारी',
    changePassword: 'पासवर्ड बदलें', preferences: 'प्राथमिकताएं',
    saveChanges: 'परिवर्तन सहेजें', fullName: 'पूरा नाम', phone: 'फ़ोन',
    emailCannotChange: 'ईमेल (बदल नहीं सकते)', darkModeLabel: 'डार्क मोड',
    darkModeDesc: 'डार्क थीम', languageLabel: 'भाषा',
    currentPassword: 'वर्तमान पासवर्ड', newPassword: 'नया पासवर्ड',
    confirmPassword: 'नया पासवर्ड पुष्टि',
    ownerDashboard: 'मालिक डैशबोर्ड', totalProperties: 'मेरी संपत्तियां',
    totalBookings: 'कुल बुकिंग', totalRevenue: 'कुल आय', totalViews: 'कुल देखे',
    occupancy: 'अधिभोग', monthlyBookings: 'मासिक बुकिंग',
    monthlyRevenue: 'मासिक आय', quickActions: 'त्वरित क्रियाएं',
    viewProperties: 'संपत्तियां देखें', manageBookings: 'बुकिंग प्रबंधन',
    editProperty: 'संपत्ति संपादित', deleteProperty: 'संपत्ति हटाएं',
    addPropertyTitle: 'नई संपत्ति जोड़ें', editPropertyTitle: 'संपत्ति संपादित करें',
    propertyImages: 'संपत्ति छवियां', basicInfo: 'बुनियादी जानकारी',
    address: 'पता', mapLocation: 'नक्शा स्थान', features: 'विशेषताएं',
    submitForApproval: 'अनुमोदन के लिए सबमिट', updateProperty: 'संपत्ति अपडेट', uploading: 'अपलोड...',
    adminDashboard: 'एडमिन डैशबोर्ड', manageUsers: 'उपयोगकर्ता प्रबंधन',
    approveProperties: 'संपत्ति अनुमोदन', manageReviews: 'समीक्षा प्रबंधन',
    broadcastEmail: 'प्रसारण ईमेल', sendTo: 'को भेजें', allUsers: 'सभी उपयोगकर्ता',
    tenantsOnly: 'केवल किरायेदार', ownersOnly: 'केवल मालिक', subject: 'विषय',
    message: 'संदेश', sendBroadcast: 'प्रसारण ईमेल भेजें', sending: 'भेजा जा रहा है...',
    compareProperties: 'संपत्ति तुलना', selectAtLeast2: 'तुलना के लिए कम से कम 2 संपत्ति चुनें',
    searchProperty: 'संपत्ति खोजें...', noResults: 'कोई परिणाम नहीं',
  }
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    // Apply dark class to <html> element so ALL pages go dark
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.backgroundColor = '#111827'
      document.documentElement.style.color = '#f9fafb'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.backgroundColor = '#ffffff'
      document.documentElement.style.color = '#111827'
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => translations[language]?.[key] || translations.en[key] || key

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
