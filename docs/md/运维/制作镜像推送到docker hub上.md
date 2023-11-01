---
title: "制作镜像推送到docker hub上"
tag: "运维"
classify: "md"
description: "docker的常用操作"
pubDate: "2023/11/1 15:33:30"
heroImage: ""
---

# 制作docker镜像 

## 登录
```shell
docker login hub仓库地址
```
## 制作镜像
```shell
docker build -f ./Dockerfile -t <name> .
```

## 查看镜像
```shell
docker images
```

## retag
```shell
docker tag  <镜像id>  <hub地址>/<用户名>/<name>:<tag>
```

## push镜像
```shell
docker push  <hub地址>/<用户名>/<name>:<tag>
```

## 删除镜像
```shell
docker rmi <镜像id>
```


# docker的常用命令
## docker 进程
### 启动docker
```shell
service docker start
```
### 关机docker
```shell
service docker stop
```
### 重启docker
```shell
service docker restart
```

## 查看容器
```shell
docker ps -a -s
```
```
docker start <容器id/容器名>
docker stop <容器id/容器名>
docker restart <容器id/容器名>
docker rm <容器id/容器名>
```

## 运行启动容器
```shell
docker run -d --name=jmni -p 8080:80 -v /home/jmni/www:/var/www centos:latest 
```
```
--restart=always <程序被终止后还能重启继续启动>
-d<容器运行与前台或者后台，不加上时前台>
--name=jmni<容器名>
-p 8080<宿主机端口>:80<容器端口>
-v /home/jmni/www<宿主机目录>:/var/www<容器目录>
centos<镜像name>:latest<镜像标签>
```

## 查询容器日志
```shell
docker logs -f -t --since="2019-05-11" --tail=10 <容器id/容器名>
```
```
--since : 指定输出日志开始日期，即只输出指定日期之后的日志
-f : 查看实时日志
-t : 查看日志产生的日期
--tail=10 : 查看最后的 10 条日志
```
## 进入容器
```shell
docker exec -it <容器id/容器名> /bin/bash
```

