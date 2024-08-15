# Paystub Generator

This React application generates custom paystubs for Evmos DAO contributors. It provides a user-friendly interface for inputting payment details and generates a professional-looking PDF paystub.

## Features

- User-friendly form for inputting paystub details
- Real-time paystub preview
- PDF generation with custom styling
- Responsive design using Chakra UI
- Integration with Evmos DAO branding

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/evmos-dao-paystub-generator.git
   ```

2. Navigate to the project directory:
   ```
   cd evmos-dao-paystub-generator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

1. Fill in the paystub details in the form.
2. Review the live preview of the paystub.
3. Click the "Generate Paystub" button to create a PDF.
4. The PDF will automatically download to your device.

## Dependencies

- React
- Chakra UI
- jsPDF
- html2canvas

## Project Structure

- `src/PaystubGenerator.js`: Main component containing the form and paystub generation logic
- `src/App.js`: Root component that renders the PaystubGenerator
- `src/index.js`: Entry point of the application
- `src/styles.css`: Global styles

## Customization

To customize the logo, replace the image file at `/images/evmos-dao-logo-white.png` with your desired logo.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
