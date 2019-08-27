package com.stijaktech.devnews.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@RestController
@RequestMapping("/utils")
public class UtilController {

    private RestTemplate restTemplate;

    @Autowired
    public UtilController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/fetch-title/{url}")
    public String fetchTitle(@PathVariable("url") String url) throws IOException {
        ResponseEntity<Resource> e = restTemplate.exchange(url, HttpMethod.GET, HttpEntity.EMPTY, Resource.class);
        e.getBody().getInputStream();
        return "Test";
    }

}
