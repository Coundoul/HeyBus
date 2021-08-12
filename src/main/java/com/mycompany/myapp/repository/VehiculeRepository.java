package com.mycompany.myapp.repository;


import java.util.List;

import com.mycompany.myapp.domain.Transporteur;
import com.mycompany.myapp.domain.Vehicule;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Vehicule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    @Query("select vehicule from Vehicule vehicule where vehicule.transporteur.user.login = ?#{principal.username}")
    List<Vehicule> findByUserIsCurrentUser();

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login = ?#{principal.username}")
    Transporteur findCurrentTransporteur();
}
