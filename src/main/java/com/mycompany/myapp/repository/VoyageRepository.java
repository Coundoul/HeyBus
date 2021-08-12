package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Transporteur;
import com.mycompany.myapp.domain.Ville;
import com.mycompany.myapp.domain.Voyage;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Voyage entity.
 */
@Repository
public interface VoyageRepository extends JpaRepository<Voyage, Long> {
    @Query(
        value = "select distinct voyage from Voyage voyage left join fetch voyage.employes left join fetch voyage.arrets",
        countQuery = "select count(distinct voyage) from Voyage voyage"
    )
    Page<Voyage> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct voyage from Voyage voyage left join fetch voyage.employes left join fetch voyage.arrets")
    List<Voyage> findAllWithEagerRelationships();

    @Query("select voyage from Voyage voyage left join fetch voyage.employes left join fetch voyage.arrets where voyage.id =:id")
    Optional<Voyage> findOneWithEagerRelationships(@Param("id") Long id);

    @Query(
        value = "select distinct voyage from Voyage voyage left join voyage.employes left join voyage.arrets where voyage.transporteur.user.login = ?#{principal.username}",
        countQuery = "select count(distinct voyage) from Voyage voyage"
    )
    Page<Voyage> findByUserIsCurrentUser(Pageable pageable);

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login = ?#{principal.username}")
    Transporteur findCurrentTransporteur();

    Page<Voyage> findByDateDeVoyageBetweenAndDepartVilleAndArriveVilleAndNbrePlaceGreaterThanEqual(
        Pageable pageable,
        ZonedDateTime date,
        ZonedDateTime date2,
        Ville arrive,
        Ville depart,
        Integer nbrePassagers
    );

    @Query(
        "select voyage from Voyage voyage where ((voyage.dateDeVoyage>= :date1 and voyage.dateDeVoyage<= :date2) or (voyage.dateDeVoyage>= :date3 and voyage.dateDeVoyage<= :date4)) and ((voyage.departVille=:departVille and voyage.arriveVille=:arriveVille) or (voyage.departVille=:arriveVille and voyage.arriveVille=:departVille)) and voyage.nbrePlace>=:nbrePlace "
    )
    Page<Voyage> voyageRetour(
        @Param("date1") ZonedDateTime date1,
        @Param("date2") ZonedDateTime date2,
        @Param("date3") ZonedDateTime date3,
        @Param("date4") ZonedDateTime date4,
        @Param("departVille") Ville departVille,
        @Param("arriveVille") Ville arriveVille,
        @Param("nbrePlace") Integer nbrePlace,
        Pageable pageable
    );
}
