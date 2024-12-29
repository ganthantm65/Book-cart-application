<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db_server = "localhost";
$db_user = "root";  
$db_pass = "";      
$db_name = "book_db"; 

$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}else{
    if($_SERVER['REQUEST_METHOD']=="POST"){
        $request=file_get_contents("php://input");
        $data=json_decode($request,true);
        $genre=$data['genre'];

        $sql = "SELECT * FROM Books WHERE genre = '$genre'";
        $result = mysqli_query($conn, $sql);

        $response=[];
        if ($result && mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)){
                array_push($response,$row);
            }
            echo json_encode(["success"=>true,"response"=>$response]);
        } else {
            echo json_encode(["success" => false,"message"=>"Data not found"]);
        }
    }else{
        echo json_encode(["success" => false,"message"=>"Invalid action"]);
        http_response_code(404);
    }
}
?>