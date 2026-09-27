package com.codelab.controller;

import com.codelab.model.CodeFile;
import com.codelab.model.CreateFileRequest;
import com.codelab.model.UpdateFileRequest;
import com.codelab.service.FileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    public List<CodeFile> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/{name}")
    public CodeFile getFile(@PathVariable String name) {
        return fileService.getFile(name);
    }

    @PostMapping
    public ResponseEntity<CodeFile> createFile(@Valid @RequestBody CreateFileRequest request) {
        CodeFile created = fileService.createFile(
                request.getName(), request.getLanguage(), request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{name}")
    public CodeFile updateFile(@PathVariable String name,
                               @RequestBody UpdateFileRequest request) {
        String content = request != null ? request.getContent() : null;
        String language = request != null ? request.getLanguage() : null;
        return fileService.updateFile(name, content, language);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteFile(@PathVariable String name) {
        fileService.deleteFile(name);
        return ResponseEntity.noContent().build();
    }
}
