package com.loganalyzer.service;

import com.loganalyzer.model.*;
import com.loganalyzer.repository.AnalysisSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalysisSessionService {

    private final AnalysisSessionRepository repository;

    public AnalysisSessionService(AnalysisSessionRepository repository) {
        this.repository = repository;
    }

    public AnalysisSession saveSession(String fileName, String originalText, List<LogEntry> parsedLogs) {
        List<LogEntryEntity> entities = parsedLogs.stream()
                .map(log -> new LogEntryEntity(log.getTimestamp(), log.getLevel(), log.getSource(), log.getMessage()))
                .collect(Collectors.toList());

        AnalysisSession session = new AnalysisSession(fileName, originalText, LocalDateTime.now(), entities);
        return repository.save(session);
    }

    public List<AnalysisSession> getAllSessions() {
        return repository.findAll();
    }

    public AnalysisSession getSessionById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteSession(Long id) {
        repository.deleteById(id);
    }
}
