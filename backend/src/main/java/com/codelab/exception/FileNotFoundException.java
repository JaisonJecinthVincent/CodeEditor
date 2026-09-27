package com.codelab.exception;

public class FileNotFoundException extends RuntimeException {
    public FileNotFoundException(String name) {
        super("File not found: " + name);
    }
}
