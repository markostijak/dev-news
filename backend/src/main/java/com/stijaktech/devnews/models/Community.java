package com.stijaktech.devnews.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Community {

    @Id
    private String id;
    private String logo;
    @Indexed
    private String title;
    private long members;
    private Status status;
    public List<Post> posts;
    private String createdBy;
    private String updatedBy;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
