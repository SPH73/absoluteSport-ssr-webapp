# AbsoluteSport Web Application Platform — Client Overview

This document explains, in simple terms, what work has been completed, why it matters, and how the system now operates in production.

## 1. What This System Does

The AbsoluteSport web app handles:

- Football academy bookings (currently paused by client)
- Event ticket bookings (now out of date)
- Camp bookings
- Party enquiries
- Contact requests
- Club/school sports bookings
- Testimonials, reviews and FAQs
- Covers the full booking lifecycle, from user form submission through to payment processing
- Content sourced from Airtable (your CMS)

Everything is now running on a modern, stable, secure platform.

## 2. Recent Improvements (Nov 2025)

| Area                    | Benefit                                                       |
| ----------------------- | ------------------------------------------------------------- |
| Airtable protection     | Booking forms no longer fail during Airtable outages          |
| Security hardening      | Reduced bot attacks and unexpected traffic                    |
| New fallback system     | Visitors see a “Booking Paused” page instead of broken forms  |
| Logging upgrades        | All suspicious / outdated URLs are logged                     |
| Stability in production | No more 429 / rate limit crashes                              |
| Full platform migration | Upgraded from older Nuxt version to Nuxt 4 (modern framework) |

## 3. Booking Stability

A new protection layer ensures that when Airtable is overloaded, visitors are redirected safely to a **Booking Paused** page.

## 4. Enhanced Security

Includes:

- CSP (Content Security Policy)
- Legacy URL attack logging
- Hardened SSR layer
- Improved reliability of all forms

## 5. Hosting

Hosted on Netlify:

- Fast global delivery
- Auto scaling
- Serverless API functions

## 6. Maintenance Recommendations

- Quarterly security review
- Airtable usage monitoring
- Annual performance tune-up

## Contact

Sue Holder (piDev) — Freelance Developer & Technical Lead
<sue@designdevelophost.co.uk>
