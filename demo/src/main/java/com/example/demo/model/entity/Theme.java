package com.example.demo.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "themes")
public class Theme {
    @Id
    private String id;
    private String name;
    private String backgroundColor;         // Required for single-color themes
    private String backgroundColorLeft;     // Optional for split-color left side
    private String backgroundColorRight;    // Optional for split-color right side
    private String textColor;
    private boolean isActive;

    public Theme() {}

    public Theme(String name, String backgroundColor, String textColor, boolean isActive) {
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.isActive = isActive;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
    public String getBackgroundColorLeft() { return backgroundColorLeft; }
    public void setBackgroundColorLeft(String backgroundColorLeft) { this.backgroundColorLeft = backgroundColorLeft; }
    public String getBackgroundColorRight() { return backgroundColorRight; }
    public void setBackgroundColorRight(String backgroundColorRight) { this.backgroundColorRight = backgroundColorRight; }
    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
}