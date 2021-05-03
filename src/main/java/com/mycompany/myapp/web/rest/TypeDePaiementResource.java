package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TypeDePaiement;
import com.mycompany.myapp.repository.TypeDePaiementRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TypeDePaiement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeDePaiementResource {

    private final Logger log = LoggerFactory.getLogger(TypeDePaiementResource.class);

    private static final String ENTITY_NAME = "typeDePaiement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeDePaiementRepository typeDePaiementRepository;

    public TypeDePaiementResource(TypeDePaiementRepository typeDePaiementRepository) {
        this.typeDePaiementRepository = typeDePaiementRepository;
    }

    /**
     * {@code POST  /type-de-paiements} : Create a new typeDePaiement.
     *
     * @param typeDePaiement the typeDePaiement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeDePaiement, or with status {@code 400 (Bad Request)} if the typeDePaiement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-de-paiements")
    public ResponseEntity<TypeDePaiement> createTypeDePaiement(@Valid @RequestBody TypeDePaiement typeDePaiement)
        throws URISyntaxException {
        log.debug("REST request to save TypeDePaiement : {}", typeDePaiement);
        if (typeDePaiement.getId() != null) {
            throw new BadRequestAlertException("A new typeDePaiement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeDePaiement result = typeDePaiementRepository.save(typeDePaiement);
        return ResponseEntity
            .created(new URI("/api/type-de-paiements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-de-paiements/:id} : Updates an existing typeDePaiement.
     *
     * @param id the id of the typeDePaiement to save.
     * @param typeDePaiement the typeDePaiement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeDePaiement,
     * or with status {@code 400 (Bad Request)} if the typeDePaiement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeDePaiement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-de-paiements/{id}")
    public ResponseEntity<TypeDePaiement> updateTypeDePaiement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TypeDePaiement typeDePaiement
    ) throws URISyntaxException {
        log.debug("REST request to update TypeDePaiement : {}, {}", id, typeDePaiement);
        if (typeDePaiement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeDePaiement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeDePaiementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeDePaiement result = typeDePaiementRepository.save(typeDePaiement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeDePaiement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-de-paiements/:id} : Partial updates given fields of an existing typeDePaiement, field will ignore if it is null
     *
     * @param id the id of the typeDePaiement to save.
     * @param typeDePaiement the typeDePaiement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeDePaiement,
     * or with status {@code 400 (Bad Request)} if the typeDePaiement is not valid,
     * or with status {@code 404 (Not Found)} if the typeDePaiement is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeDePaiement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-de-paiements/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<TypeDePaiement> partialUpdateTypeDePaiement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TypeDePaiement typeDePaiement
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeDePaiement partially : {}, {}", id, typeDePaiement);
        if (typeDePaiement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeDePaiement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeDePaiementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeDePaiement> result = typeDePaiementRepository
            .findById(typeDePaiement.getId())
            .map(
                existingTypeDePaiement -> {
                    if (typeDePaiement.getPaiement() != null) {
                        existingTypeDePaiement.setPaiement(typeDePaiement.getPaiement());
                    }

                    return existingTypeDePaiement;
                }
            )
            .map(typeDePaiementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeDePaiement.getId().toString())
        );
    }

    /**
     * {@code GET  /type-de-paiements} : get all the typeDePaiements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeDePaiements in body.
     */
    @GetMapping("/type-de-paiements")
    public List<TypeDePaiement> getAllTypeDePaiements() {
        log.debug("REST request to get all TypeDePaiements");
        return typeDePaiementRepository.findAll();
    }

    /**
     * {@code GET  /type-de-paiements/:id} : get the "id" typeDePaiement.
     *
     * @param id the id of the typeDePaiement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeDePaiement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-de-paiements/{id}")
    public ResponseEntity<TypeDePaiement> getTypeDePaiement(@PathVariable Long id) {
        log.debug("REST request to get TypeDePaiement : {}", id);
        Optional<TypeDePaiement> typeDePaiement = typeDePaiementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeDePaiement);
    }

    /**
     * {@code DELETE  /type-de-paiements/:id} : delete the "id" typeDePaiement.
     *
     * @param id the id of the typeDePaiement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-de-paiements/{id}")
    public ResponseEntity<Void> deleteTypeDePaiement(@PathVariable Long id) {
        log.debug("REST request to delete TypeDePaiement : {}", id);
        typeDePaiementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
