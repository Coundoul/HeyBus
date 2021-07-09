package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Photo;
import com.mycompany.myapp.domain.Transporteur;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Photo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    @Query("select photo from Photo photo where photo.transporteur.user.login = ?#{principal.username}")
    List<Photo> findByUserIsCurrentUser();

    @Query("select transporteur from Transporteur transporteur where transporteur.user.login = ?#{principal.username}")
    Transporteur findCurrentTransporteur();
}
