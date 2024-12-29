<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");


$db_server = "localhost";
$db_user = "root";  
$db_pass = "";      
$db_name = "book_db"; 

$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} else {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $request = file_get_contents('php://input');
        $product = json_decode($request); 
        $product_value = mysqli_real_escape_string($conn, $product->element);

        $sql = "SELECT * FROM Books WHERE bookname = '$product_value' OR genre = '$product_value'";
        $result = mysqli_query($conn, $sql);

        $response = [];
        if (mysqli_num_rows($result) != 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($response, $row);
            }
            echo json_encode(['success' => true, 'response' => $response]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Books not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}
?>
