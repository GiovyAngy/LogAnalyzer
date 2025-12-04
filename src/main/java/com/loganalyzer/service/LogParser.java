package com.loganalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loganalyzer.model.LogEntry;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LogParser {

    private static final Pattern classicPattern = Pattern.compile(
            "^\\[?(\\d{4}[-/]\\d{2}[-/]\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}(?:[,\\.]\\d{1,3})?)\\]?\\s*" +
                    "(ERROR|WARN|INFO|DEBUG|TRACE)?\\s*(\\S+)?\\s*-?\\s*(.*)$"
    );

    private static final Pattern webAccessPattern = Pattern.compile(
            "^(\\S+)\\s+(\\S+)\\s+(\\S+)\\s+\\[([^]]+)]\\s+\"([A-Z]+)\\s([^\\s]+)\\sHTTP/\\d\\.\\d\"\\s(\\d{3})\\s(\\d+|-).*$"
    );

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static List<LogEntry> parseLogs(String logText) {
        List<LogEntry> logs = new ArrayList<>();
        String[] lines = logText.split("\\r?\\n");

        for (String line : lines) {

            // 1) JSON LOG
            if (line.startsWith("{") && line.endsWith("}")) {
                parseJsonLog(line, logs);
                continue;
            }

            // 2) WEB ACCESS LOG
            Matcher webMatcher = webAccessPattern.matcher(line);
            if (webMatcher.matches()) {

                String ip = webMatcher.group(1);
                String timestamp = webMatcher.group(4);
                String method = webMatcher.group(5);
                String path = webMatcher.group(6);
                String status = webMatcher.group(7);

                logs.add(new LogEntry(
                        timestamp,
                        "HTTP " + status,
                        ip,
                        method + " " + path
                ));
                continue;
            }

            // 3) CLASSIC LOG
            Matcher classicMatcher = classicPattern.matcher(line);
            if (classicMatcher.matches()) {

                String timestamp = classicMatcher.group(1);
                String level = classicMatcher.group(2);
                String source = classicMatcher.group(3);
                String message = classicMatcher.group(4);

                logs.add(new LogEntry(timestamp, level, source, message));
            }
        }

        return logs;
    }

    private static void parseJsonLog(String line, List<LogEntry> logs) {
        try {
            JsonNode json = objectMapper.readTree(line);

            String timestamp = json.has("timestamp") ? json.get("timestamp").asText() : null;
            String level = json.has("level") ? json.get("level").asText() : "INFO";
            String source = json.has("service") ? json.get("service").asText() : "JSON";
            String message = json.has("message") ? json.get("message").asText() : json.toString();

            logs.add(new LogEntry(timestamp, level, source, message));

        } catch (Exception ignored) {

        }
    }
}
