#########################################################################
# File Name: install-wine.sh
# Author: VOID_133
# QQ: 393952764
# mail: zhangjianqiu13@gmail.com
# Created Time: Mon 22 Jun 2015 10:52:42 AM CST
#########################################################################
#!/bin/bash
echo "Build Start"
git clone git://source.winehq.org/git/wine.git
cd wine
sudo apt-get update
sudo apt-get install build-essential
./configure
./make

