package com.stijaktech.devnews.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discussion {

    @Id
    private String id;
    private String title;
    private String image;
    private Status status;
    public List<Post> posts;
    private String createdBy;
    private String updatedBy;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
