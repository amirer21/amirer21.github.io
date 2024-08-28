---
title: Ubuntu - tmp 폴더
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Ubuntu
tags:
- Ubuntu
- tmp
toc: true
toc_sticky: true
toc_label: 목차
description: Ubuntu - tmp 폴더
article_tag1: ubuntu
article_tag2: tmp
article_tag3: systemd
article_section: ubuntu
meta_keywords: ubuntu, tmp
last_modified_at: '2024-03-26 21:00:00 +0800'
---

# Ubuntu 에서 tmp 폴더

Ubuntu를 비롯한 대부분의 Linux 배포판에서 /tmp 폴더는 임시 파일을 저장하기 위한 공간으로 사용됩니다. 이 디렉토리는 시스템 사용 중 생성되는 일시적인 파일들, 예를 들어 프로그램 실행 중 임시로 필요한 데이터 파일이나 프로세스 간 통신을 위한 소켓 파일 등이 저장되는 곳입니다.

/tmp 디렉토리의 주요 특징은 그 안에 저장된 파일들이 재부팅을 거치면 대부분 사라진다는 점입니다. 이러한 특성 때문에 /tmp는 임시 작업 파일을 저장할 장소로 적합하지만, 중요한 데이터를 장기간 보관할 목적으로는 적합하지 않습니다.

Ubuntu에서 /tmp 폴더의 정리 방식은 시스템 설정에 따라 다를 수 있습니다. 기본적으로는 시스템 재시작 시 /tmp 내의 파일들이 삭제되도록 설정되어 있지만, 이는 시스템의 tmpfiles.d 설정이나 systemd 서비스의 구성에 따라 달라질 수 있습니다. 일부 시스템에서는 tmpwatch나 tmpreaper 같은 유틸리티를 이용하여 정기적으로 /tmp 디렉토리를 정리하도록 설정되어 있을 수도 있습니다.

또한, 최신 시스템에서는 /tmp가 tmpfs 파일 시스템을 사용하여 메모리에 마운트되기도 합니다. 이 경우, /tmp 내의 데이터는 실제 디스크에 저장되지 않고 RAM에서 관리되므로, 시스템이 재시작되면 자동으로 내용이 지워지게 됩니다.

결론적으로, /tmp 폴더는 재부팅 시 내용이 삭제될 수 있으므로 임시 파일 저장용도로 사용되며, 장기간 보관이 필요한 중요한 파일을 저장하기에는 적합하지 않습니다.