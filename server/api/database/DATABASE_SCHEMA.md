# DATABASE_SCHEMA.md

## Instruction

Update the schema.ts file in this directory to ensure all TypeScript interfaces are congruent with the actual Airtable base schema described below. Each interface should:

- Include all fields listed for each table, matching field names and types as closely as possible.
- Use appropriate TypeScript types: string, number, boolean, Date, or arrays as needed.
- For relational fields (e.g. school, camp, venue), use string or a reference type if defined elsewhere.
- For status and select fields, use union string types with all possible values if known.
- For boolean/flag fields, use boolean.
- For date/time fields, use string (ISO format) or Date if preferred.
- For fields with multiple possible types (e.g. attachments, arrays), use the most descriptive type possible.

## Airtable Table Schemas

Paste the full contents of database-schema.txt below for reference:

---

### 1.1 fa-bookings (Football Academy Bookings)

- surname: string
- childName: string
- parentName: string
- email: string
- mobile: string
- venue: string
- academy: string
- age: number
- medicalConditions: string
- bookingRef: string
- paymentRef: string
- photo: string
- sessions: string
- time: string
- termCost: number
- startDate: string
- endDate: string
- status: 'pending' | 'confirmed' | 'cancelled'
- createdDate: string
- lastModifiedBy: string

### 1.2 fa-payments (Football Academy Payments)

- parentName: string
- bookingCreatedOn: string
- recordID: string
- numBookings: number
- children: string
- paymentRef: string
- status: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
- amountDue: number
- amountPaid: number
- contactNumber: string
- email: string
- termsAccepted: boolean
- created: string

### 1.3 camp-bookings (Holiday Camp Bookings)

- childSurname: string
- childName: string
- created: string
- parentName: string
- status: string
- childAge: number
- campName: string
- location: string
- daysBooked: string[]
- totalDays: number
- price: number
- pupilPrem: boolean
- hafID: string
- photos: string
- bookingRef: string
- paymentRef: string

### 1.4 camp-payments (Holiday Camp Payments)

- parentName: string
- created: string
- email: string
- mainPhone: string
- paymentRef: string
- amountDue: number
- status: string
- numChildren: number
- childrenNames: string
- emailSent: boolean

### 1.5 club-bookings (After-School Clubs Bookings)

- surname: string
- school: string
- club: string
- yearGroup: string
- paymentRef: string
- bookingRef: string
- childName: string
- parentName: string
- contactNumber: string
- email: string
- altParentName: string
- altParentContact: string
- medicalConds: string
- sessionCost: number
- sessionsPerTerm: number
- termCost: number
- startDate: string
- endDate: string
- status: string
- createdDate: string
- statusLastModified: string
- lastModifiedBy: string
- condition: string

### 1.6 club-payments (After-School Clubs Payments)

- surname: string
- bookingCreatedOn: string
- recordID: string
- school: string
- yearGroup: string
- medicalConds: string
- clubsQty: number
- clubsBooked: string
- paymentRef: string
- status: string
- amountDue: number
- amountPaid: number
- childName: string
- parentName: string
- contactNumber: string
- email: string
- emailSent: boolean
- created: string
- notes: string

## 2. Lookup & Configuration Tables

(See database-schema.txt for full details)

## 3. Content & SEO Tables

(See database-schema.txt for full details)

## 4. Enquiries & Contact

(See database-schema.txt for full details)

## 5. Modelling Guidance

- Text fields: string
- Boolean/flags: boolean
- Status/select: union string types
- Dates/times: string (ISO)
- Numbers: number
- Relational: string or reference type
- Attachments/arrays: string[] or appropriate type

---

Refer to this file whenever updating schema.ts to ensure all interfaces are congruent with the Airtable base.
