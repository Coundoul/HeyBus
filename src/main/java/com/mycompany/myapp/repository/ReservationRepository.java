  
package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Reservation;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("select reservation from Reservation reservation where reservation.voyage.transporteur.user.login = ?#{principal.username}")
    List<Reservation> findByUserIsCurrentUser();

    @Query("select reservation from Reservation reservation where reservation.customer.user.login = ?#{principal.username}")
    List<Reservation> findByCustomerIsCurrentCustomer();
}