package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Arret;
import com.mycompany.myapp.repository.ArretRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Arret}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArretResource {

    private final Logger log = LoggerFactory.getLogger(ArretResource.class);

    private static final String ENTITY_NAME = "arret";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArretRepository arretRepository;

    public ArretResource(ArretRepository arretRepository) {
        this.arretRepository = arretRepository;
    }

    /**
     * {@code POST  /arrets} : Create a new arret.
     *
     * @param arret the arret to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new arret, or with status {@code 400 (Bad Request)} if the arret has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/arrets")
    public ResponseEntity<Arret> createArret(@RequestBody Arret arret) throws URISyntaxException {
        log.debug("REST request to save Arret : {}", arret);
        if (arret.getId() != null) {
            throw new BadRequestAlertException("A new arret cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Arret result = arretRepository.save(arret);
        return ResponseEntity
            .created(new URI("/api/arrets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /arrets/:id} : Updates an existing arret.
     *
     * @param id the id of the arret to save.
     * @param arret the arret to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated arret,
     * or with status {@code 400 (Bad Request)} if the arret is not valid,
     * or with status {@code 500 (Internal Server Error)} if the arret couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/arrets/{id}")
    public ResponseEntity<Arret> updateArret(@PathVariable(value = "id", required = false) final Long id, @RequestBody Arret arret)
        throws URISyntaxException {
        log.debug("REST request to update Arret : {}, {}", id, arret);
        if (arret.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, arret.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!arretRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Arret result = arretRepository.save(arret);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, arret.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /arrets/:id} : Partial updates given fields of an existing arret, field will ignore if it is null
     *
     * @param id the id of the arret to save.
     * @param arret the arret to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated arret,
     * or with status {@code 400 (Bad Request)} if the arret is not valid,
     * or with status {@code 404 (Not Found)} if the arret is not found,
     * or with status {@code 500 (Internal Server Error)} if the arret couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/arrets/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Arret> partialUpdateArret(@PathVariable(value = "id", required = false) final Long id, @RequestBody Arret arret)
        throws URISyntaxException {
        log.debug("REST request to partial update Arret partially : {}, {}", id, arret);
        if (arret.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, arret.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!arretRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Arret> result = arretRepository
            .findById(arret.getId())
            .map(
                existingArret -> {
                    if (arret.getDescription() != null) {
                        existingArret.setDescription(arret.getDescription());
                    }

                    return existingArret;
                }
            )
            .map(arretRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, arret.getId().toString())
        );
    }

    /**
     * {@code GET  /arrets} : get all the arrets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of arrets in body.
     */
    @GetMapping("/arrets")
    public List<Arret> getAllArrets() {
        log.debug("REST request to get all Arrets");
        return arretRepository.findAll();
    }

    /**
     * {@code GET  /arrets/:id} : get the "id" arret.
     *
     * @param id the id of the arret to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the arret, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/arrets/{id}")
    public ResponseEntity<Arret> getArret(@PathVariable Long id) {
        log.debug("REST request to get Arret : {}", id);
        Optional<Arret> arret = arretRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(arret);
    }

    /**
     * {@code DELETE  /arrets/:id} : delete the "id" arret.
     *
     * @param id the id of the arret to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/arrets/{id}")
    public ResponseEntity<Void> deleteArret(@PathVariable Long id) {
        log.debug("REST request to delete Arret : {}", id);
        arretRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
