package com.codelab.model;

import jakarta.validation.constraints.NotBlank;

public class CreateFileRequest {

    @NotBlank(message = "File name must not be blank")
    private String name;

    @NotBlank(message = "Language must not be blank")
    private String language;

    private String content = "";

    public CreateFileRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
