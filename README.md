###1. vi的基本概念
基本上vi可以分为三种状态，分别是命令模式（command mode）、插入模式（Insert mode）和底行模式（last line mode），各模式的功能区分如下：
(1) **命令行模式**(command mode）
控制屏幕光标的移动，字符、字或行的删除，移动复制某区段及进入Insert mode下，或者到 last line mode。
(2) **插入模式**（Insert mode）
只有在Insert mode下，才可以做文字输入，按「ESC」键可回到命令行模式。
(3)**底行模式**（last line mode）
将文件保存或退出vi，也可以设置编辑环境，如寻找字符串、列出行号……等。不过一般我们在使用时把vi简化成两个模式，就是将底行模式（last line mode）也算入命令行模式command mode）。
###2. vi的基本操作
**(a) 进入vi在系统提示符号**
输入vi及文件名称后，就进入vi全屏幕编辑画面：$ vi myfile。不过有一点要特别注意，就是您进入vi之后，是处于「命令行模式（command mode）」，您要切换到「插入模式（Insert mode）」才能够输入文字。按下「i」转换到「插入模式（Insert mode）」再说吧！
**(b) 切换至插入模式（Insert mode）**
编辑文件在「命令行模式（command mode）」下按一下字母「i」就可以进入「插入模式（Insert mode）」，这时候你就可以开始输入文字了。
**(c) Insert 的切换**
您目前处于「插入模式（Insert mode）」，您就只能一直输入文字，如果您发现输错了字！想用光标键往回移动，将该字删除，就要先按一下「ESC」键转到「命令行模式（command mode）」再删除文字。
**(d) 退出vi及保存文件**
「命令行模式」下，按一下「：」冒号键进入「Last line mode」
「插入模式」下，按下「shift+：」进入「Last line mode」。例如：
: w filename （输入 「w filename」将文章以指定的文件名filename保存）
: wq (输入「wq」，存盘并退出vi)
: q! (输入q!， 不存盘强制退出vi)
