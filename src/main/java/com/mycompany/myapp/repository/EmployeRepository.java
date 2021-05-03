package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Employe;
import com.mycompany.myapp.domain.Transporteur;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Employe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    @Query("select employe from Employe employe where employe.transporteur.user.login = ?#{principal.username}")
    List<Employe> findByUserIsCurrentUser();

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login = ?#{principal.username}")
    Transporteur findCurrentTransporteur();
}
