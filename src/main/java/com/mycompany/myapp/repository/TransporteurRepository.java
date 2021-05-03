package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Transporteur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Transporteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransporteurRepository extends JpaRepository<Transporteur, Long> {}
