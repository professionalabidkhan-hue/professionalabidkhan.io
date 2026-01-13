<?php
// C:\xamppA\htdocs\abidkhan-e-pedagogy-institute\ai_assistant.php

function analyzeJobWithAI($jobTitle, $desc = "") {
    $insights = [
        "Cyber"     => "Matches 'Sentinel-6' Security protocols. High priority for Hub members.",
        "Developer" => "Direct alignment with our Full-Stack Architecture modules. Career growth: Exponential.",
        "React"     => "Frontend dominance role. Ideal for modern UI specialists in the community.",
        "Research"  => "Pedagogy-linked opportunity. High value for academic portfolio building.",
        "Default"   => "Verified opportunity. Aligns with Hub professional standards."
    ];

    // Case-insensitive search
    $title = strtolower($jobTitle);
    
    if (strpos($title, 'cyber') !== false) return $insights["Cyber"];
    if (strpos($title, 'developer') !== false) return $insights["Developer"];
    if (strpos($title, 'react') !== false) return $insights["React"];
    if (strpos($title, 'research') !== false) return $insights["Research"];
    
    return $insights["Default"];
}
?>
