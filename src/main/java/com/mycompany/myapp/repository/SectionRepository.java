package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Section;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Section entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {}
