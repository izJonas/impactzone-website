New-Item -Path ..\public\css\iz-styles-all.scss -ItemType "file" -Value "" -Force

$lines = Get-Content -Path ..\scss\aggregate.template
$lines | ForEach-Object -Begin $null -Process { Get-Content -Path $_  -Encoding UTF8 | Out-File -FilePath ..\public\css\iz-styles-all.scss -Append -Encoding utf8 } -End $null


New-Item -Path ..\public\js\iz-funct.js -ItemType "file" -Value "" -Force
New-Item -Path ..\public\js\iz-module-load.js -ItemType "file" -Value "" -Force
Copy-Item -Path ..\javascript\iz-module-load.js -Destination ..\public\js\iz-module-load.js -Force
$lines2 = Get-Content -Path ..\javascript\aggregate.template
$lines2 | ForEach-Object -Begin $null -Process { Get-Content -Path $_  -Encoding UTF8 | Out-File -FilePath ..\public\js\iz-funct.js -Append -Encoding utf8 } -End $null


& code ..\public\css\iz-styles-all.scss ..\public\js\iz-funct.js
