package com.loganalyzer.model;


public class LogEntry {
    private String timestamp;
    private String level;
    private String source;
    private String message;

    public LogEntry(String timestamp, String level, String source, String message) {
        this.timestamp = timestamp != null ? timestamp : "";
        this.level = level != null ? level : "";
        this.source = source != null ? source : "";
        this.message = message != null ? message : "";
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void appendMessage(String extra) {
        this.message += extra;
    }
}
