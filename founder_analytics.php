<?php
// --- FOUNDER ANALYTICS HEADERS ---
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// THE MASTER BRIDGE
require_once 'connect.php'; 

$analytics = [];

// 1. Total Student Count
$res1 = mysqli_query($conn, "SELECT COUNT(*) AS TOTAL FROM ak_users");
$analytics['total_members'] = mysqli_fetch_assoc($res1)['TOTAL'];

// 2. Department Breakdown
$res2 = mysqli_query($conn, "SELECT department, COUNT(*) AS COUNT FROM ak_users GROUP BY department");
while ($row = mysqli_fetch_assoc($res2)) {
    $analytics['departments'][] = $row;
}

// 3. Global Location Strike
$res3 = mysqli_query($conn, "SELECT location, COUNT(*) AS COUNT FROM ak_users GROUP BY location");
while ($row = mysqli_fetch_assoc($res3)) {
    $analytics['locations'][] = $row;
}

echo json_encode($analytics);
mysqli_close($conn);
?>
