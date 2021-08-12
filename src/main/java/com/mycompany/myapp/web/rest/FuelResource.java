package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Fuel;
import com.mycompany.myapp.repository.FuelRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Fuel}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FuelResource {

    private final Logger log = LoggerFactory.getLogger(FuelResource.class);

    private static final String ENTITY_NAME = "fuel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FuelRepository fuelRepository;

    public FuelResource(FuelRepository fuelRepository) {
        this.fuelRepository = fuelRepository;
    }

    /**
     * {@code POST  /fuels} : Create a new fuel.
     *
     * @param fuel the fuel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fuel, or with status {@code 400 (Bad Request)} if the fuel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fuels")
    public ResponseEntity<Fuel> createFuel(@Valid @RequestBody Fuel fuel) throws URISyntaxException {
        log.debug("REST request to save Fuel : {}", fuel);
        if (fuel.getId() != null) {
            throw new BadRequestAlertException("A new fuel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fuel result = fuelRepository.save(fuel);
        return ResponseEntity
            .created(new URI("/api/fuels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fuels/:id} : Updates an existing fuel.
     *
     * @param id the id of the fuel to save.
     * @param fuel the fuel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fuel,
     * or with status {@code 400 (Bad Request)} if the fuel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fuel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fuels/{id}")
    public ResponseEntity<Fuel> updateFuel(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Fuel fuel)
        throws URISyntaxException {
        log.debug("REST request to update Fuel : {}, {}", id, fuel);
        if (fuel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fuel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fuelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fuel result = fuelRepository.save(fuel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fuel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fuels/:id} : Partial updates given fields of an existing fuel, field will ignore if it is null
     *
     * @param id the id of the fuel to save.
     * @param fuel the fuel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fuel,
     * or with status {@code 400 (Bad Request)} if the fuel is not valid,
     * or with status {@code 404 (Not Found)} if the fuel is not found,
     * or with status {@code 500 (Internal Server Error)} if the fuel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fuels/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Fuel> partialUpdateFuel(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Fuel fuel
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fuel partially : {}, {}", id, fuel);
        if (fuel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fuel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fuelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fuel> result = fuelRepository
            .findById(fuel.getId())
            .map(
                existingFuel -> {
                    if (fuel.getTypeDeCarburant() != null) {
                        existingFuel.setTypeDeCarburant(fuel.getTypeDeCarburant());
                    }
                    if (fuel.getDate() != null) {
                        existingFuel.setDate(fuel.getDate());
                    }
                    if (fuel.getKm() != null) {
                        existingFuel.setKm(fuel.getKm());
                    }
                    if (fuel.getNbLitre() != null) {
                        existingFuel.setNbLitre(fuel.getNbLitre());
                    }
                    if (fuel.getMontant() != null) {
                        existingFuel.setMontant(fuel.getMontant());
                    }

                    return existingFuel;
                }
            )
            .map(fuelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fuel.getId().toString())
        );
    }

    /**
     * {@code GET  /fuels} : get all the fuels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fuels in body.
     */
    @GetMapping("/fuels")
    public List<Fuel> getAllFuels() {
        log.debug("REST request to get all Fuels");
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) 
        return fuelRepository.findAll();
        
        return fuelRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /fuels/:id} : get the "id" fuel.
     *
     * @param id the id of the fuel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fuel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fuels/{id}")
    public ResponseEntity<Fuel> getFuel(@PathVariable Long id) {
        log.debug("REST request to get Fuel : {}", id);
        Optional<Fuel> fuel = fuelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fuel);
    }

    /**
     * {@code DELETE  /fuels/:id} : delete the "id" fuel.
     *
     * @param id the id of the fuel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fuels/{id}")
    public ResponseEntity<Void> deleteFuel(@PathVariable Long id) {
        log.debug("REST request to delete Fuel : {}", id);
        fuelRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
