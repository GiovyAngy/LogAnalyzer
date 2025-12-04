package com.loganalyzer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class AnalysisSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private String originalText;

    private LocalDateTime createdAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "session_id")
    private List<LogEntryEntity> logEntries;

    public AnalysisSession() {}

    public AnalysisSession(String fileName, String originalText, LocalDateTime createdAt, List<LogEntryEntity> logEntries) {
        this.fileName = fileName;
        this.originalText = originalText;
        this.createdAt = createdAt;
        this.logEntries = logEntries;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<LogEntryEntity> getLogEntries() {
        return logEntries;
    }

    public void setLogEntries(List<LogEntryEntity> logEntries) {
        this.logEntries = logEntries;
    }
}