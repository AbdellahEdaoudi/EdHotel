// printInvoice.js
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const PrintReservation = (bk) => {
  const CheckIn = format(new Date(bk.check_in), "MMMM do, yyyy", { locale: enUS });
  const CheckOut = format(new Date(bk.check_out), "MMMM do, yyyy", { locale: enUS });

  const printContent = `
    <html>
      <head>
        <title>EdHotel Reservation Payment</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            color: #333;
            background-color: #f9f9f9;
          }
          .invoice-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-header img {
            max-width: 100px;
            margin-bottom: 20px;
          }
          .invoice-header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
          }
          .invoice-details {
            margin-bottom: 20px;
          }
          .invoice-details p {
            margin: 5px 0;
            font-size: 18px;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 20px;
          }
          .invoice-footer p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>EdHotel Reservation Payment</h1>
            <img src="https://urlimage.vercel.app/Logo-my-hotel-app.png" alt="Hotel Logo"/>
          </div>
          <div class="invoice-details">
            <p><strong>Reservation ID:</strong> ${bk._id}</p>
            <p><strong>Room Name:</strong> ${bk.nameR}</p>
            <p><strong>Email:</strong> ${bk.email}</p>
            <p><strong>From:</strong> ${CheckIn}</p>
            <p><strong>To:</strong> ${CheckOut}</p>
            <p><strong>Price:</strong> ${bk.prix}$</p>
          </div>
          <div class="invoice-footer">
            <p>Thank you for choosing our hotel!</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            alert("Take a screenshot of your reservation.");
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
};

export default PrintReservation;

