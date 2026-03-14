<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $firstName = filter_var($_POST['firstName'], FILTER_SANITIZE_STRING);
    $lastName = filter_var($_POST['lastName'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $country = filter_var($_POST['country'], FILTER_SANITIZE_STRING);
    $idNumber = filter_var($_POST['idNumber'], FILTER_SANITIZE_STRING);
    $checkin = filter_var($_POST['checkin'], FILTER_SANITIZE_STRING);
    $checkout = filter_var($_POST['checkout'], FILTER_SANITIZE_STRING);
    $adults = filter_var($_POST['adults'], FILTER_SANITIZE_NUMBER_INT);
    $children = filter_var($_POST['children'], FILTER_SANITIZE_NUMBER_INT);
    $roomType = filter_var($_POST['roomType'], FILTER_SANITIZE_STRING);
    $numRooms = filter_var($_POST['numRooms'], FILTER_SANITIZE_NUMBER_INT);
    $mealPlan = filter_var($_POST['mealPlan'], FILTER_SANITIZE_STRING);
    $specialRequests = filter_var($_POST['specialRequests'], FILTER_SANITIZE_STRING);


    // Collect children ages if any
    $childrenAges = [];
    if ($children > 0) {
        for ($i = 1; $i <= $children; $i++) {
            if (isset($_POST["childAge$i"])) {
                $childrenAges[] = filter_var($_POST["childAge$i"], FILTER_SANITIZE_NUMBER_INT);
            }
        }
    }
    $childrenAgesStr = !empty($childrenAges) ? implode(", ", $childrenAges) : "N/A";

    // Recipient email
    $to = "reservation@hotelxenia.in";
    $subject = "New Room Reservation Request - $firstName $lastName";

    // Email Body (HTML)
    $message = "
    <html>
    <head>
        <title>New Reservation Request</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header { background: #0d0d0d; color: #d4af37; padding: 10px; text-align: center; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #d4af37; padding-bottom: 5px; margin-bottom: 10px; color: #d4af37; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; width: 150px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Hotel Xenia</h1>
                <p>New Reservation Request</p>
            </div>
            
            <div class='section'>
                <div class='section-title'>Guest Details</div>
                <table>
                    <tr><td class='label'>Name:</td><td>$firstName $lastName</td></tr>
                    <tr><td class='label'>Email:</td><td>$email</td></tr>
                    <tr><td class='label'>Phone:</td><td>$phone</td></tr>
                    <tr><td class='label'>Country:</td><td>$country</td></tr>
                    <tr><td class='label'>ID/Passport:</td><td>$idNumber</td></tr>
                </table>
            </div>

            <div class='section'>
                <div class='section-title'>Booking Details</div>
                <table>
                    <tr><td class='label'>Check-In:</td><td>$checkin</td></tr>
                    <tr><td class='label'>Check-Out:</td><td>$checkout</td></tr>
                    <tr><td class='label'>Adults:</td><td>$adults</td></tr>
                    <tr><td class='label'>Children:</td><td>$children ($childrenAgesStr)</td></tr>
                    <tr><td class='label'>Room Type:</td><td>$roomType</td></tr>
                    <tr><td class='label'>No. of Rooms:</td><td>$numRooms</td></tr>
                    <tr><td class='label'>Meal Plan:</td><td>$mealPlan</td></tr>

                </table>
            </div>

            <div class='section'>
                <div class='section-title'>Special Requests</div>
                <p>" . (empty($specialRequests) ? "None" : nl2br($specialRequests)) . "</p>
            </div>
            
            <div style='text-align: center; font-size: 0.8rem; color: #888; margin-top: 30px;'>
                This is an automated notification from the Hotel Xenia website.
            </div>
        </div>
    </body>
    </html>
    ";

    // Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: website@hotelxenia.in" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // Send Email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "Reservation request sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email. Please try again later."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
}
?>
