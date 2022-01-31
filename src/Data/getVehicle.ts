interface MediaFormat {
  format: '770x514';
  id: '2cf086f3-b681-4ba3-8287-28578f8ed5d1';
  url: 'https://test-cdn.wayketech.se/media/012b8218-a7ae-4dd4-9152-e385faffeba9/5f9cad90-2f7a-4ae4-898a-de0f8a1cf52f/770x514';
  webp: 'https://test-cdn.wayketech.se/media/012b8218-a7ae-4dd4-9152-e385faffeba9/5f9cad90-2f7a-4ae4-898a-de0f8a1cf52f/770x514.webp';
}

interface MediaFile {
  formats: MediaFormat[];
  id: '5f9cad90-2f7a-4ae4-898a-de0f8a1cf52f';
  sortOrder: 0;
  url: 'https://test-cdn.wayketech.se/media/012b8218a7ae4dd49152e385faffeba9/5f9cad902f7a4ae4898ade0f8a1cf52f';
}

interface Media {
  files: MediaFile[];
  id: '012b8218-a7ae-4dd4-9152-e385faffeba9';
  sortOrder: 1;
  type: 'Image';
}

export interface Vehicle {
  acceptsTestDriveInquiries: boolean;
  accessories: any[];
  branches: [
    {
      authorizedResellerForManufacturer: boolean;
      city: string;
      connectedBranches: string[] | null;
      hasTestDriveInquiry: boolean;
      id: string;
      isCentralStorage: boolean;
      latitude: number;
      longitude: number;
      name: string;
      slug: string | null;
      testDriveInquiryEmail: string | null;
    }
  ];
  commerce: {
    enabled: boolean;
    reserved: boolean;
    disabledOnWayke: boolean;
    allowTradeIn: boolean;
    homeDelivery: boolean;
  };
  contactOptions: {
    avatarUrl: string | null;
    displayName: string | null;
    id: string | null;
    telephone: string | null;
    title: string | null;
    email: string | null;
  };
  deductibleVat: boolean;
  description: string;
  documents: [];
  enginePower: 190;
  externalUrl: null;
  featuredImage: Media;
  financialOptions: [];
  fuelType: string;
  gearbox: string;
  gearboxType: string;
  hasManufacturerPackaging: boolean;
  hasMrfPackaging: boolean;
  id: string;
  insuranceOptions: [];
  isAuctionItem: boolean;
  itemCreated: string;
  itemPublished: string;
  itemSort: string;
  leasingPrice: 0;
  leasingPromos: [];
  manufactureYear: number;
  manufacturer: string;
  media: Media[];
  mediaTypes: string[];
  mileage: number;
  modelName: string;
  modelSeries: string;
  modelYear: number;
  oldPrice: number;
  options: string[];
  paymentOptions: [];
  position: {
    city: 'Myggenäs';
    location: { lat: 58.0544357; lon: 11.7575378 };
    street: 'Tången 11';
    zip: '47161';
  };
  price: number;
  registrationNumber: string;
  resellerPackagingOptions: [];
  sellerType: 'branch';
  shortDescription: string;
  title: string;
  users: null;
  _id: string;
  _type: null;
}

interface Response {
  documentList: {
    documents: Vehicle[];
  };
}

export const getVehicle = (id: string) => {
  return fetch(`https://test.wayketech.se/api/search/${id}`)
    .then((response) => response.json())
    .then((json: Response) => json?.documentList?.documents?.[0]);
};
