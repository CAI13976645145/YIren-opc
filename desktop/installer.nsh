; 安装前确保旧进程退出，避免 Windows 文件锁导致 resources/app 复制不完整
!macro customInit
  nsExec::Exec 'taskkill /IM "一人公司.exe" /T /F'
!macroend
