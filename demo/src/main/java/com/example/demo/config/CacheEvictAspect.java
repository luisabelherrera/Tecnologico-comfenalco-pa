package com.example.demo.config;


import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CacheEvictAspect {

    @Pointcut("@annotation(cacheEvict)")
    public void cacheEvictMethods(CacheEvict cacheEvict) {}

    @After("cacheEvictMethods(cacheEvict)")
    public void afterCacheEvict(CacheEvict cacheEvict) {
        String[] cacheNames = cacheEvict.value();
        for (String cacheName : cacheNames) {
          System.out.println("La caché '" + cacheName + "' ha sido eliminada de Redis.");
        }
    }
}