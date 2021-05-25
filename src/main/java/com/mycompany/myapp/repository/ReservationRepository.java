package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Reservation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query( value = "select reservation from Reservation reservation where reservation.voyage.transporteur.user.login = ?#{principal.username}",
            countQuery = "select count(distinct reservation) from Reservation reservation")
    Page<Reservation> findByUserIsCurrentUser(Pageable pageable);


    @Query( value = "select reservation from Reservation reservation where reservation.customer.user.login = ?#{principal.username}",
            countQuery = "select count(distinct reservation) from Reservation reservation")
    Page<Reservation> findByCustomerIsCurrentCustomer(Pageable pageable); 

    @Query( value = "select reservation from Reservation reservation where reservation.voyage.id = :voyageId",
            countQuery = "select count(distinct reservation) from Reservation reservation")
    Page<Reservation> findCustomerByVoyage(Pageable pageable, @Param("voyageId") Long voyageId);
}
