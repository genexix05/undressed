<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.textcortex.com/v1/codes",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n  \"max_tokens\": 2048,\n  \"mode\": \"python\",\n  \"model\": \"icortex-1\",\n  \"n\": 1,\n  \"temperature\": 0,\n  \"text\": \"short text of apples\"\n}",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer gAAAAABmIjmSaJu_OlqEib36rBXOZMX83VPBXYXdqZxie1GtX65Jm5kPQQdhjHZ8CXvHFBczw0MICEtZg7w602vRjupEFYyNE9yAwUeJWBGUtYWL_8B-bnwresUSnVbedfLZybZzi33_",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}