package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Maintenance;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Maintenance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    @Query("select maintenance from Maintenance maintenance where maintenance.vehicule.transporteur.user.login = ?#{principal.username}")
    List<Maintenance> findByUserIsCurrentUser();
}
