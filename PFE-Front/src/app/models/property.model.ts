export interface Property {
    id: number;
    generalinfo: GeneralInfo;
    location: Location;
    Specification: Specification;
    price: Price;
    Amenities: Amenities;
    contacts: Contacts;
    Media: Media;
    bookings: Booking[];
    user: userprofile;
    approval: string;
    viewCount: string;
    createdAt: string; 
  }
  
  export interface GeneralInfo {
    id: number;
    deal_type: string;
    title: string;
    dealType: string;
    description: string;
    PropertyCondition: string;
    propertyCondition: string;
    propertyType: string;
    availabilityDate: string | null;
  }
  
  export interface Location {
    id: number;
    latitude: number;
    longitude: number;
    country: string;
    city: string;
    subcity: string;
  }
  
  export interface Specification {
    id: number;
    bedrooms: string;
    bathrooms: string;
    parkingSpots: string;
    size: string | null;
    plotSize: string | null;
    builtUpArea: string | null;
    constructionYear: number | null;
    renovationyear: number | null;
    furnishing: string | null;
  }
  
  export interface Price {
    id: number;
    price: string;
    pricesqft: string | null;
    originalprice: string | null;
    hideprice: boolean;
    charges: string | null;
    servicecharge: string | null;
    priceunit: string | null;
  }
  
  export interface Amenities {
    id: number;
    centralAC: boolean;
    parking: boolean;
    elevator: boolean;
    petsAllowed: boolean;
    conciergeService: boolean;
    securityService: boolean;
    lobbyInBuilding: boolean;
    maidsRoom: boolean;
    studyRoom: boolean;
    balcony: boolean;
    walkInCloset: boolean;
    childrensPlayArea: boolean;
    garden: boolean;
    barbecueArea: boolean;
    jacuzzi: boolean;
    sauna: boolean;
    sharedGym: boolean;
    privateGym: boolean;
    sharedPool: boolean;
    privatePool: boolean;
    spa: boolean;
    viewOfWater: boolean;
    viewOfLandmark: boolean;
    nearbyHospitals: boolean;
    nearbyPublicTransport: boolean;
    nearbySchools: boolean;
    nearbyShopping: boolean;
  }
  export interface MediaItem {
    id: number;
    imageFile: File | null;
    imageName: string;
    imageSize: number;
    updatedAt: string;
  }
  
  export interface Media {
    id: number;
    photos: MediaItem[];
    floorPlans: MediaItem[];
    documents: MediaItem[];
  }

  export interface Contacts {
    id: number;
    email: string;
    phone: string;
  }
  export interface Booking {
    id?: number; 
    startDate: string;
    endDate: string;
    propertyId: number;
    approval?: string;
    status?: string;
      popertyTitle: string;
    propertyCity: string;
    propertysubcity: string;
  }

  export interface userprofile {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    profileImage: string ;
   
  }
  