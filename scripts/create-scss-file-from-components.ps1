New-Item -Path ..\public\css\iz-styles-all.scss -ItemType "file" -Value "" -Force

$lines = Get-Content -Path ..\scss\aggregate.template
$lines | ForEach-Object -Begin $null -Process { Get-Content -Path $_  -Encoding UTF8 | Out-File -FilePath ..\public\css\iz-styles-all.scss -Append -Encoding utf8 } -End $null

Get-Content -Path ..\public\css\iz-styles-all.scss

& code ..\public\css\iz-styles-all.scss
