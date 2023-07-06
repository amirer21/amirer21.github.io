---
title: Python - Thread 이벤트 모니터링 처리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: Thread 이벤트 모니터링 처리
article_tag1: python
article_tag2: thread
article_tag3: 
article_section: thread
meta_keywords: python, thread
last_modified_at: '2023-06-13 21:00:00 +0800'
---

## Thread 이벤트 모니터링 처리



```py
class Event:
    """Class implementing event objects.

    Events manage a flag that can be set to true with the set() method and reset
    to false with the clear() method. The wait() method blocks until the flag is
    true.  The flag is initially false.

    """
```

> "Event 클래스에서 

> set()는 true로 설정할 수 있는 플래그를 관리하고 재설정한다. 
```py
def set(self):
    with self._cond:
        self._flag = True
        self._cond.notify_all()
```
> clear() 메서드를 사용하여 false로 변경한다. 
```py
def clear(self):
    with self._cond:
        self._flag = False
```
            
>wait() 메서드는 플래그가 표시될 때까지 차단된다. "
```py    
def wait(self, timeout=None):        
    with self._cond:
        signaled = self._flag
        if not signaled:
            signaled = self._cond.wait(timeout)
        return signaled
```

## 이벤트를 모니터링하는 Thread 예제
```py
import threading
import time

#Thread 클래스
class TossMonitorThread(threading.Thread):
    def __init__(self, interval):
        threading.Thread.__init__(self)
        self.interval = interval
        #self._stop = threading.Event()
        self._stop_event = threading.Event()
        #_stop_event는 스레드가 중지되어야 하는지 계속 실행되어야 하는지 신호를 보내는데 사용된다.
        self.terminate_flag = True

    def run(self):
        while self.terminate_flag:
            if self.stopped(): # 내부 플러그에 따라 중단 여부판단
                print("stopped")
                return			
            print("주기적으로 실행")
            time.sleep(self.interval)
    
    def stop(self):
        #self._stop.set()
        self._stop_event.set()
        #특정 이벤트가 발생했음을 나타내는 이벤트를 설정하는 데 사용된다.
        #내부 플래그를 true로 설정한다.
        
    def stopped(self):
        #return self._stop.is_set()
        return self._stop_event.is_set()
        #내부 플래그가 true인 경우에만 true를 반환한다.
        #is_set은 _stop_event설정되어 있으면 스레드가 중지되고 run()메서드가 루프를 종료하고 반환해야 함을 의미합

    def terminate(self):
        self.terminate_flag = False

#Toast Error Monitor 클래스
class ToastErrorMonitor:
    def toastMonitor(self):
        returnErrorText = ''
        while True:            
            try:
                #특정 이벤트 발생하는지 체크하는 로직                              
                #something... event
                #returnExample == 'Error            
            except Exception as e:
                print('not found toast error')                                
            
            #위의 로직에 따라 조건에 맞는 이벤트가 발생하면 스레드 종료
            if returnExample == 'Error':            
                print("Exiting the thread...")
                monitor_thread.terminate()  # Set the termination flag
                monitor_thread.join()  # Wait for the thread to finish
                break
            else:
                print("Toast Error Not Found")
            time.sleep(3)  # Sleep for 3 seconds
        print("---Toast Error monitor 종료---")
        
#Monitor 실행
monitor_thread = TossMonitorThread(interval=3)  # 매 2초마다 반복하여 모니터링
monitor_thread.start()

#쓰레드 중지
#위에 ToastErrorMonitor 클래스의 toastMonitor메서드의 while 반복절과 상관없이 stop
time.sleep(10)
monitor_thread.stop()
monitor_thread.join()
```