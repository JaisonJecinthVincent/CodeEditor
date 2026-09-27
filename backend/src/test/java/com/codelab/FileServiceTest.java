package com.codelab;

import com.codelab.exception.DuplicateFileException;
import com.codelab.exception.FileNotFoundException;
import com.codelab.model.CodeFile;
import com.codelab.service.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FileServiceTest {

    private FileService fileService;

    @BeforeEach
    void setUp() {
        fileService = new FileService();
    }

    @Test
    void createFile_shouldStoreFile() {
        CodeFile file = fileService.createFile("main.js", "javascript", "console.log('hi');");

        assertEquals("main.js", file.getName());
        assertEquals("javascript", file.getLanguage());
        assertEquals("console.log('hi');", file.getContent());
    }

    @Test
    void getFile_shouldReturnStoredFile() {
        fileService.createFile("hello.py", "python", "print('Hello CodeLab')");

        CodeFile found = fileService.getFile("hello.py");

        assertEquals("hello.py", found.getName());
        assertEquals("python", found.getLanguage());
    }

    @Test
    void getAllFiles_shouldReturnAllStoredFiles() {
        fileService.createFile("main.js", "javascript", "code1");
        fileService.createFile("utils.py", "python", "code2");

        List<CodeFile> all = fileService.getAllFiles();

        assertEquals(2, all.size());
    }

    @Test
    void updateFile_shouldChangeContent() {
        fileService.createFile("main.py", "python", "print('old')");

        CodeFile updated = fileService.updateFile("main.py", "print('Updated Code')", null);

        assertEquals("print('Updated Code')", updated.getContent());
    }

    @Test
    void deleteFile_shouldRemoveFile() {
        fileService.createFile("temp.js", "javascript", "x");

        fileService.deleteFile("temp.js");

        assertThrows(FileNotFoundException.class, () -> fileService.getFile("temp.js"));
    }

    @Test
    void createFile_duplicateName_shouldThrow() {
        fileService.createFile("main.js", "javascript", "a");

        assertThrows(DuplicateFileException.class,
                () -> fileService.createFile("main.js", "javascript", "b"));
    }

    @Test
    void getFile_missing_shouldThrow() {
        assertThrows(FileNotFoundException.class, () -> fileService.getFile("missing.js"));
    }

    @Test
    void createFile_blankName_shouldThrow() {
        assertThrows(IllegalArgumentException.class,
                () -> fileService.createFile("  ", "javascript", "x"));
    }

    @Test
    void createFile_blankLanguage_shouldThrow() {
        assertThrows(IllegalArgumentException.class,
                () -> fileService.createFile("main.js", "  ", "x"));
    }
}
