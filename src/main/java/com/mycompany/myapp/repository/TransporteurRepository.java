package com.mycompany.myapp.repository;

import java.util.Optional;

import com.mycompany.myapp.domain.Transporteur;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Transporteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransporteurRepository extends JpaRepository<Transporteur, Long> {

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login =:user")
    Optional<Transporteur> findByUser(@Param("user") String user);
}
