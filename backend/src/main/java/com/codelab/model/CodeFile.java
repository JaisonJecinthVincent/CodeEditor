package com.codelab.model;

public class CodeFile {
    private String name;
    private String language;
    private String content;

    public CodeFile() {
    }

    public CodeFile(String name, String language, String content) {
        this.name = name;
        this.language = language;
        this.content = content;
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
