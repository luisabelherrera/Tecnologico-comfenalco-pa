package com.example.demo.model.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "themes")
public class Theme {
    @Id
    private String id;
    private String name;
    private String backgroundColor;
    private String textColor;
    private boolean isActive; // Indica si este tema está activo

    public Theme() {}

    public Theme(String name, String backgroundColor, String textColor, boolean isActive) {
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.isActive = isActive;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
}