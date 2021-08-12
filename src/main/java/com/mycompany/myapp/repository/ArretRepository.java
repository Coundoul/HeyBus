package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Arret;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Arret entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArretRepository extends JpaRepository<Arret, Long> {}
