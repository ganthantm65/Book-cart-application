<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db_server = "localhost";
$db_user = "root";  
$db_pass = "";      
$db_name = "liberex_users"; 

$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $user = json_decode($data, true);

    if (isset($user['email'], $user['password'])) {
        $email = mysqli_real_escape_string($conn, $user['email']);
        $password = $user['password'];

        $sql = "SELECT * FROM Users WHERE email = '$email'";
        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            if (password_verify($password, $row['password'])) {
                session_start();
                $_SESSION['user'] = $row['user'];
                echo json_encode(["success" => true, "user" => $row['user'],"cartno"=>$row['cartno'],"message"=>"Login successfully"]);
            } else {
                echo json_encode(["success" => false,"message"=>"Invalid password"]);
            }
        } else {
            echo json_encode(["success" => false,"message"=>"User not found"]);
            http_response_code(404);
        }
    } else {
        echo json_encode(["success" => false,"message"=>"Not a proper email or password"]);
        http_response_code(404);
    }
}

mysqli_close($conn);
?>
