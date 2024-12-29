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
    else{
        if ($_SERVER['REQUEST_METHOD']=="POST") {
            $request = file_get_contents("php://input");
            $data = json_decode($request, true);
                
            if(is_array($data) && count($data)!=0){
                $user_name = mysqli_real_escape_string($conn, $data['user']);
                $email = mysqli_real_escape_string($conn, $data['email']);
                $password = password_hash($data['password'], PASSWORD_DEFAULT);
                $phone = mysqli_real_escape_string($conn, $data['phone']);
    
                $sql="INSERT INTO Users (user, password, email, phoneno) VALUES ('$user_name', '$password', '$email', $phone)";
                if (mysqli_query($conn, $sql)) {
                    echo json_encode(["success" => true, "user" => $user_name,"message"=>"Login successfully"]);;
                  } else {
                    echo json_encode(["success" => false,"message"=>"Invalid data"]) ;
                  }
            }else{
                echo"Please enter valid data";
            }
        }
        mysqli_close($conn);
    }
?>