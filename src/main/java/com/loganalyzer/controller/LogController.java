package com.loganalyzer.controller;

import com.loganalyzer.model.*;
import com.loganalyzer.service.*;
import org.springframework.web.bind.annotation.*;
import com.loganalyzer.service.AnalysisSessionService;
import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogController {

    private final AnalysisSessionService sessionService;

    public LogController(AnalysisSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/parse-text")
    public List<LogEntry> parseText(@RequestBody String logText) {
        return LogParser.parseLogs(logText);
    }


    @PostMapping("/save-session")
    public AnalysisSession saveSession(@RequestParam(required = false) String fileName, @RequestBody String logText) {
        List<LogEntry> parsedLogs = LogParser.parseLogs(logText);
        return sessionService.saveSession(fileName != null ? fileName : "Pasted text", logText, parsedLogs);
    }

    @GetMapping("/sessions")
    public List<AnalysisSession> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/sessions/{id}")
    public AnalysisSession getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id);
    }

    @DeleteMapping("/sessions/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
    }
}