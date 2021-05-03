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
        "select distinct voyage from Voyage voyage left join fetch voyage.employes left join fetch voyage.arrets where voyage.transporteur.user.login = ?#{principal.username}"
    )
    List<Voyage> findByUserIsCurrentUser();

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login = ?#{principal.username}")
    Transporteur findCurrentTransporteur();

    List<Voyage> findByDateDeVoyageBetweenAndDepartVilleAndArriveVille(ZonedDateTime date, ZonedDateTime date2, Ville arrive, Ville depart);
}
