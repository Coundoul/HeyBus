package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Fuel;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Fuel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuelRepository extends JpaRepository<Fuel, Long> {
    @Query("select fuel from Fuel fuel where fuel.vehicule.transporteur.user.login = ?#{principal.username}")
    List<Fuel> findByUserIsCurrentUser();
}