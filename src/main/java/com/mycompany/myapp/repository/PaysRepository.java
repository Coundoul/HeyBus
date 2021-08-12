package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Pays;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pays entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {}
