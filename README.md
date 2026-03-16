# B Beyond Hair & Beauty Saloon

This is a web portal for **B Beyond Hair & Beauty Saloon**, located in Kudal, Sindhudurg. It serves as an informative site and a booking platform for salon services.

## Features

*   **Responsive Design:** Optimized for both desktop and mobile viewing.
*   **Service & Pricing Details:** Clear overview of all available services and transparent pricing.
*   **Booking System:** Allows clients to easily request appointments. Bookings are integrated with WhatsApp for instant communication and logged in Firebase for tracking.
*   **Client Reviews:** Displays testimonials and allows new clients to submit their experiences via a star-rating system.
*   **Admin Panel:** Access restricted backend interface to manage and view incoming bookings and reviews, secured via Firebase Auth.
*   **Gallery:** Showcase of transformations and salon environment.

## Technologies Used

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript.
*   **Backend / Database:** Firebase (Authentication and Firestore).
*   **Form Handling:** EmailJS for automated email notifications, direct integration with WhatsApp API.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
2.  **Environment Variables:**
    *   The project uses Firebase. You need to provide your own Firebase configuration.
    *   Create a `.env` file in the root directory and add your Firebase API key (as a reference, though static HTML cannot directly read it without a build step):
        ```env
        FIREBASE_API_KEY=your_api_key_here
        ```
    *   In `index.html`, locate the `firebaseConfig` object and ensure the values match your Firebase project settings. *Note: As this is a static HTML file, the API key must be injected during a build process or fetched securely if you wish to keep it completely hidden from the client side in production.*
3.  **Open the project:**
    *   Simply open `index.html` in your web browser. A local server (like Live Server extension in VS Code) is recommended for all features to work correctly.

## Admin Access

The admin panel is accessible via the "Admin Panel" link in the footer. Access requires pre-configured credentials via Firebase Authentication.
