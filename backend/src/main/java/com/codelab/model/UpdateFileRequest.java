package com.codelab.model;

public class UpdateFileRequest {
    private String content;
    private String language;

    public UpdateFileRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
