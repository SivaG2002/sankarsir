<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

function send_response($data) {
    echo json_encode($data);
    exit;
}

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    send_response(array('error' => 'Method not allowed.'));
}

$dataDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'data';
$counterFile = $dataDirectory . DIRECTORY_SEPARATOR . 'page-visits.json';

if (!is_dir($dataDirectory) && !@mkdir($dataDirectory, 0755, true)) {
    send_response(array('count' => 0, 'stored' => false));
}

$handle = @fopen($counterFile, 'c+');
if ($handle === false || !@flock($handle, LOCK_EX)) {
    send_response(array('count' => 0, 'stored' => false));
}

$rawData = stream_get_contents($handle);
$savedData = json_decode($rawData ? $rawData : '{}', true);
$count = max(0, (int) (isset($savedData['count']) ? $savedData['count'] : 0));

if ($method === 'POST') {
    $count++;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode(array('count' => $count), JSON_PRETTY_PRINT));
}

flock($handle, LOCK_UN);
fclose($handle);

send_response(array('count' => $count, 'stored' => true));
