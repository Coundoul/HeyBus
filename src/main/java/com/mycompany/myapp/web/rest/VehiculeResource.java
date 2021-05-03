package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Vehicule;
import com.mycompany.myapp.repository.VehiculeRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Vehicule}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VehiculeResource {

    private final Logger log = LoggerFactory.getLogger(VehiculeResource.class);

    private static final String ENTITY_NAME = "vehicule";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VehiculeRepository vehiculeRepository;

    public VehiculeResource(VehiculeRepository vehiculeRepository) {
        this.vehiculeRepository = vehiculeRepository;
    }

    /**
     * {@code POST  /vehicules} : Create a new vehicule.
     *
     * @param vehicule the vehicule to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vehicule, or with status {@code 400 (Bad Request)} if the vehicule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vehicules")
    public ResponseEntity<Vehicule> createVehicule(@Valid @RequestBody Vehicule vehicule) throws URISyntaxException {
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_TRANSPORTEUR")) {
            //set the Current Transporteur
            vehicule.setTransporteur(vehiculeRepository.findCurrentTransporteur());
        }
        log.debug("REST request to save Vehicule : {}", vehicule);
        if (vehicule.getId() != null) {
            throw new BadRequestAlertException("A new vehicule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vehicule result = vehiculeRepository.save(vehicule);
        return ResponseEntity
            .created(new URI("/api/vehicules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vehicules/:id} : Updates an existing vehicule.
     *
     * @param id the id of the vehicule to save.
     * @param vehicule the vehicule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicule,
     * or with status {@code 400 (Bad Request)} if the vehicule is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vehicule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vehicules/{id}")
    public ResponseEntity<Vehicule> updateVehicule(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Vehicule vehicule
    ) throws URISyntaxException {
        //set the Current Transporteur
        vehicule.setTransporteur(vehiculeRepository.findCurrentTransporteur());
        log.debug("REST request to update Vehicule : {}, {}", id, vehicule);
        if (vehicule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehiculeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vehicule result = vehiculeRepository.save(vehicule);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicule.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vehicules/:id} : Partial updates given fields of an existing vehicule, field will ignore if it is null
     *
     * @param id the id of the vehicule to save.
     * @param vehicule the vehicule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicule,
     * or with status {@code 400 (Bad Request)} if the vehicule is not valid,
     * or with status {@code 404 (Not Found)} if the vehicule is not found,
     * or with status {@code 500 (Internal Server Error)} if the vehicule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vehicules/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Vehicule> partialUpdateVehicule(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Vehicule vehicule
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vehicule partially : {}, {}", id, vehicule);
        if (vehicule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehiculeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vehicule> result = vehiculeRepository
            .findById(vehicule.getId())
            .map(
                existingVehicule -> {
                    if (vehicule.getReference() != null) {
                        existingVehicule.setReference(vehicule.getReference());
                    }
                    if (vehicule.getNumChassis() != null) {
                        existingVehicule.setNumChassis(vehicule.getNumChassis());
                    }
                    if (vehicule.getNumCarteGrise() != null) {
                        existingVehicule.setNumCarteGrise(vehicule.getNumCarteGrise());
                    }
                    if (vehicule.getNbrePlace() != null) {
                        existingVehicule.setNbrePlace(vehicule.getNbrePlace());
                    }
                    if (vehicule.getMarqueVoiture() != null) {
                        existingVehicule.setMarqueVoiture(vehicule.getMarqueVoiture());
                    }
                    if (vehicule.getPhoto() != null) {
                        existingVehicule.setPhoto(vehicule.getPhoto());
                    }
                    if (vehicule.getRefcartetotal() != null) {
                        existingVehicule.setRefcartetotal(vehicule.getRefcartetotal());
                    }
                    if (vehicule.getTypemoteur() != null) {
                        existingVehicule.setTypemoteur(vehicule.getTypemoteur());
                    }

                    return existingVehicule;
                }
            )
            .map(vehiculeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicule.getId().toString())
        );
    }

    /**
     * {@code GET  /vehicules} : get all the vehicules.
     *
     *
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vehicules in body.
     */
    @GetMapping("/vehicules")
    public List<Vehicule> getAllVehicules() {
        log.debug("REST request to get all Vehicules");
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) return vehiculeRepository.findAll();
        return vehiculeRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /vehicules/:id} : get the "id" vehicule.
     *
     * @param id the id of the vehicule to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vehicule, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vehicules/{id}")
    public ResponseEntity<Vehicule> getVehicule(@PathVariable Long id) {
        log.debug("REST request to get Vehicule : {}", id);
        Optional<Vehicule> vehicule = vehiculeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vehicule);
    }

    /**
     * {@code DELETE  /vehicules/:id} : delete the "id" vehicule.
     *
     * @param id the id of the vehicule to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vehicules/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        log.debug("REST request to delete Vehicule : {}", id);
        vehiculeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
