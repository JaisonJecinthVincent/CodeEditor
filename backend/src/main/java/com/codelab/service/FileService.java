package com.codelab.service;

import com.codelab.exception.DuplicateFileException;
import com.codelab.exception.FileNotFoundException;
import com.codelab.model.CodeFile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FileService {

    private final Map<String, CodeFile> store = new ConcurrentHashMap<>();

    public CodeFile createFile(String name, String language, String content) {
        validateName(name);
        validateLanguage(language);
        if (store.containsKey(name)) {
            throw new DuplicateFileException(name);
        }
        CodeFile file = new CodeFile(name, language, content == null ? "" : content);
        store.put(name, file);
        return file;
    }

    public List<CodeFile> getAllFiles() {
        return new ArrayList<>(store.values());
    }

    public CodeFile getFile(String name) {
        CodeFile file = store.get(name);
        if (file == null) {
            throw new FileNotFoundException(name);
        }
        return file;
    }

    public CodeFile updateFile(String name, String content, String language) {
        CodeFile existing = getFile(name);
        if (content != null) {
            existing.setContent(content);
        }
        if (language != null && !language.isBlank()) {
            existing.setLanguage(language);
        }
        return existing;
    }

    public void deleteFile(String name) {
        CodeFile removed = store.remove(name);
        if (removed == null) {
            throw new FileNotFoundException(name);
        }
    }

    public void clear() {
        store.clear();
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("File name must not be blank");
        }
    }

    private void validateLanguage(String language) {
        if (language == null || language.isBlank()) {
            throw new IllegalArgumentException("Language must not be blank");
        }
    }
}
