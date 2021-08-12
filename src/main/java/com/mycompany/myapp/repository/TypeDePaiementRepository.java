package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TypeDePaiement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeDePaiement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeDePaiementRepository extends JpaRepository<TypeDePaiement, Long> {}
