package com.loganalyzer.repository;

import com.loganalyzer.model.AnalysisSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisSessionRepository extends JpaRepository<AnalysisSession, Long> {
}
