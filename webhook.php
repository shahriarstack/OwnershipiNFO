<?php
// cPanel Auto Deployment Webhook
header('Content-Type: application/json');

$cpanelHost = 's1.sitechai.com';
$cpanelPort = 2083;
$username   = 'cvacimot';
$password   = '9J9q]91tYYyzB)';

$authHeader = 'Basic ' . base64_encode("$username:$password");

// 1. Call cPanel UAPI to pull latest Git commit from GitHub
$ch = curl_init();
$url = "https://$cpanelHost:$cpanelPort/execute/VersionControl/update?repository_root=" . urlencode('/home/cvacimot/repositories/OwnershipiNFO') . "&branch=main";

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: $authHeader"]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if (isset($result['status']) && $result['status'] == 1) {
    echo json_encode([
        "status" => "success",
        "message" => "Auto-deployment completed! Latest code pulled from GitHub to cPanel.",
        "commit" => $result['data']['last_update']['identifier'] ?? 'latest',
        "author" => $result['data']['last_update']['author'] ?? 'GitHub',
        "timestamp" => date('Y-m-d H:i:s')
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Sync failed",
        "details" => $result
    ]);
}
