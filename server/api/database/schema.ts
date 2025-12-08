// Schema definitions for AbsoluteSport API endpoints
// This file provides TypeScript types for Airtable tables used in api/camps, api/clubs, api/events, api/football, api/parties

// --- Camps ---
export interface Camp {
  id: string;
  name: string;
  date: string;
  price: number;
  locationId: string;
  availability: number;
}
export interface CampBooking {
  id: string;
  campId: string;
  childName: string;
  parentName: string;
  email: string;
  status: 'new' | 'awaiting payment' | 'paid' | 'cancelled';
}
export interface CampPayment {
  id: string;
  bookingId: string;
  amount: number;
  paidAt: string;
}
export interface CampLocation {
  id: string;
  name: string;
  address: string;
}

// --- Clubs ---
export interface Club {
  id: string;
  name: string;
  schoolId: string;
  price: number;
  availability: number;
}
export interface ClubBooking {
  id: string;
  clubId: string;
  childName: string;
  parentName: string;
  email: string;
  status: 'new' | 'awaiting payment' | 'paid' | 'cancelled';
}
export interface ClubPayment {
  id: string;
  bookingId: string;
  amount: number;
  paidAt: string;
}

// --- Football Academy ---
export interface FootballAcademy {
  id: string;
  name: string;
  ageGroup: string;
  venueId: string;
  price: number;
}
export interface FootballAcademyBooking {
  id: string;
  academyId: string;
  childName: string;
  parentName: string;
  email: string;
  status: 'new' | 'awaiting payment' | 'paid' | 'cancelled';
}
export interface FootballAcademyPayment {
  id: string;
  bookingId: string;
  amount: number;
  paidAt: string;
}
export interface FootballAcademyVenue {
  id: string;
  name: string;
  address: string;
}

// --- Events ---
export interface Event {
  id: string;
  name: string;
  date: string;
  price: number;
  locationId: string;
}
export interface EventBooking {
  id: string;
  eventId: string;
  childName: string;
  parentName: string;
  email: string;
  status: 'new' | 'awaiting payment' | 'paid' | 'cancelled';
}
export interface EventPayment {
  id: string;
  bookingId: string;
  amount: number;
  paidAt: string;
}

// --- Parties ---
export interface Party {
  id: string;
  name: string;
  packageType: string;
  price: number;
  availability: number;
}
export interface PartyBooking {
  id: string;
  partyId: string;
  childName: string;
  parentName: string;
  email: string;
  status: 'new' | 'awaiting payment' | 'paid' | 'cancelled';
}
export interface PartyPayment {
  id: string;
  bookingId: string;
  amount: number;
  paidAt: string;
}
