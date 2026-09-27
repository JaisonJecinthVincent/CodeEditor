package com.codelab.exception;

public class DuplicateFileException extends RuntimeException {
    public DuplicateFileException(String name) {
        super("File already exists: " + name);
    }
}
