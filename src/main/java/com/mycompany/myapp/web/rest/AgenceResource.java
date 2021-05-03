package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Agence;
import com.mycompany.myapp.repository.AgenceRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Agence}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AgenceResource {

    private final Logger log = LoggerFactory.getLogger(AgenceResource.class);

    private static final String ENTITY_NAME = "agence";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgenceRepository agenceRepository;

    public AgenceResource(AgenceRepository agenceRepository) {
        this.agenceRepository = agenceRepository;
    }

    /**
     * {@code POST  /agences} : Create a new agence.
     *
     * @param agence the agence to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agence, or with status {@code 400 (Bad Request)} if the agence has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/agences")
    public ResponseEntity<Agence> createAgence(@Valid @RequestBody Agence agence) throws URISyntaxException {
        log.debug("REST request to save Agence : {}", agence);
        if (agence.getId() != null) {
            throw new BadRequestAlertException("A new agence cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Agence result = agenceRepository.save(agence);
        return ResponseEntity
            .created(new URI("/api/agences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agences/:id} : Updates an existing agence.
     *
     * @param id the id of the agence to save.
     * @param agence the agence to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agence,
     * or with status {@code 400 (Bad Request)} if the agence is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agence couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/agences/{id}")
    public ResponseEntity<Agence> updateAgence(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Agence agence
    ) throws URISyntaxException {
        log.debug("REST request to update Agence : {}, {}", id, agence);
        if (agence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agence.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Agence result = agenceRepository.save(agence);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agence.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agences/:id} : Partial updates given fields of an existing agence, field will ignore if it is null
     *
     * @param id the id of the agence to save.
     * @param agence the agence to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agence,
     * or with status {@code 400 (Bad Request)} if the agence is not valid,
     * or with status {@code 404 (Not Found)} if the agence is not found,
     * or with status {@code 500 (Internal Server Error)} if the agence couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/agences/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Agence> partialUpdateAgence(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Agence agence
    ) throws URISyntaxException {
        log.debug("REST request to partial update Agence partially : {}, {}", id, agence);
        if (agence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agence.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Agence> result = agenceRepository
            .findById(agence.getId())
            .map(
                existingAgence -> {
                    if (agence.getNom() != null) {
                        existingAgence.setNom(agence.getNom());
                    }
                    if (agence.getTelephone() != null) {
                        existingAgence.setTelephone(agence.getTelephone());
                    }
                    if (agence.getResponsable() != null) {
                        existingAgence.setResponsable(agence.getResponsable());
                    }

                    return existingAgence;
                }
            )
            .map(agenceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agence.getId().toString())
        );
    }

    /**
     * {@code GET  /agences} : get all the agences.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agences in body.
     */
    @GetMapping("/agences")
    public List<Agence> getAllAgences() {
        log.debug("REST request to get all Agences");
        return agenceRepository.findAll();
    }

    /**
     * {@code GET  /agences/:id} : get the "id" agence.
     *
     * @param id the id of the agence to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agence, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/agences/{id}")
    public ResponseEntity<Agence> getAgence(@PathVariable Long id) {
        log.debug("REST request to get Agence : {}", id);
        Optional<Agence> agence = agenceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(agence);
    }

    /**
     * {@code DELETE  /agences/:id} : delete the "id" agence.
     *
     * @param id the id of the agence to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/agences/{id}")
    public ResponseEntity<Void> deleteAgence(@PathVariable Long id) {
        log.debug("REST request to delete Agence : {}", id);
        agenceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
