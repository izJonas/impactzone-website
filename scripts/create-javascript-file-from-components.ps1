Remove-Item -Path ..\public\js\iz-funct.js
Remove-Item -Path ..\public\js\iz-module-load.js

New-Item -Path ..\public\js\iz-funct.js -ItemType "file" -Value "" -Force
New-Item -Path ..\public\js\iz-module-load.js -ItemType "file" -Value "" -Force
Copy-Item -Path ..\source\javascript\iz-module-load.js -Destination ..\public\js\iz-module-load.js -Force
$lines2 = Get-Content -Path ..\source\javascript\aggregate.template
$lines2 | ForEach-Object -Begin $null -Process { Get-Content -Path $_  -Encoding UTF8 | Out-File -FilePath ..\public\js\iz-funct.js -Append -Encoding utf8 } -End $null

& code ..\public\js\iz-funct.js
