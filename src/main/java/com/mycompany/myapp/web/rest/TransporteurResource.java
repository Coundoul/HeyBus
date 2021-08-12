package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Transporteur;
import com.mycompany.myapp.repository.TransporteurRepository;
import com.mycompany.myapp.repository.UserRepository;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Transporteur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TransporteurResource {

    private final Logger log = LoggerFactory.getLogger(TransporteurResource.class);

    private static final String ENTITY_NAME = "transporteur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
  
    @Autowired
    private UserRepository user;

    private final TransporteurRepository transporteurRepository;

    public TransporteurResource(TransporteurRepository transporteurRepository) {
        this.transporteurRepository = transporteurRepository;
    }

    /**
     * {@code POST  /transporteurs} : Create a new transporteur.
     *
     * @param transporteur the transporteur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transporteur, or with status {@code 400 (Bad Request)} if the transporteur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transporteurs")
    public ResponseEntity<Transporteur> createTransporteur(@Valid @RequestBody Transporteur transporteur) throws URISyntaxException {
        log.debug("REST request to save Transporteur : {}", transporteur);
        if (transporteur.getId() != null) {
            throw new BadRequestAlertException("A new transporteur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transporteur result = transporteurRepository.save(transporteur);
        return ResponseEntity
            .created(new URI("/api/transporteurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transporteurs/:id} : Updates an existing transporteur.
     *
     * @param id the id of the transporteur to save.
     * @param transporteur the transporteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transporteur,
     * or with status {@code 400 (Bad Request)} if the transporteur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transporteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transporteurs/{id}")
    public ResponseEntity<Transporteur> updateTransporteur(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Transporteur transporteur
    ) throws URISyntaxException {
        log.debug("REST request to update Transporteur : {}, {}", id, transporteur);
        if (transporteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, transporteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!transporteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Transporteur result = transporteurRepository.save(transporteur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transporteur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /transporteurs/:id} : Partial updates given fields of an existing transporteur, field will ignore if it is null
     *
     * @param id the id of the transporteur to save.
     * @param transporteur the transporteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transporteur,
     * or with status {@code 400 (Bad Request)} if the transporteur is not valid,
     * or with status {@code 404 (Not Found)} if the transporteur is not found,
     * or with status {@code 500 (Internal Server Error)} if the transporteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/transporteurs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Transporteur> partialUpdateTransporteur(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Transporteur transporteur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Transporteur partially : {}, {}", id, transporteur);
        if (transporteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, transporteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!transporteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Transporteur> result = transporteurRepository
            .findById(transporteur.getId())
            .map(
                existingTransporteur -> {
                    if (transporteur.getNom() != null) {
                        existingTransporteur.setNom(transporteur.getNom());
                    }
                    if (transporteur.getTelephone() != null) {
                        existingTransporteur.setTelephone(transporteur.getTelephone());
                    }
                    if (transporteur.getResponsable() != null) {
                        existingTransporteur.setResponsable(transporteur.getResponsable());
                    }
                    if (transporteur.getMail() != null) {
                        existingTransporteur.setMail(transporteur.getMail());
                    }
                    if (transporteur.getAdresse() != null) {
                        existingTransporteur.setAdresse(transporteur.getAdresse());
                    }
                    if (transporteur.getLogo() != null) {
                        existingTransporteur.setLogo(transporteur.getLogo());
                    }
                    if (transporteur.getLogoContentType() != null) {
                        existingTransporteur.setLogoContentType(transporteur.getLogoContentType());
                    }

                    return existingTransporteur;
                }
            )
            .map(transporteurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transporteur.getId().toString())
        );
    }

    /**
     * {@code GET  /transporteurs} : get all the transporteurs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transporteurs in body.
     */
    @GetMapping("/transporteurs")
    public ResponseEntity<List<Transporteur>> getAllTransporteurs(Pageable pageable) {
        log.debug("REST request to get a page of Transporteurs");
        Page<Transporteur> page = transporteurRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /transporteurs/:id} : get the "id" transporteur.
     *
     * @param id the id of the transporteur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transporteur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transporteurs/{id}")
    public ResponseEntity<Transporteur> getTransporteur(@PathVariable Long id) {
        log.debug("REST request to get Transporteur : {}", id);
        Optional<Transporteur> transporteur = transporteurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transporteur);
    }

     /**
     * {@code GET  /transporteurs/:id} : get the "id" transporteur.
     *
     * @param username the username of the transporteur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transporteur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transporteurs/user/{user}")
    public ResponseEntity<Transporteur> getTransporteurInfo(@PathVariable String user) {
        log.debug("REST request to get Transporteur : {}", user);
        
        Optional<Transporteur> transporteur = transporteurRepository.findByUser(user);
        return ResponseUtil.wrapOrNotFound(transporteur);
    }

    /**
     * {@code DELETE  /transporteurs/:id} : delete the "id" transporteur.
     *
     * @param id the id of the transporteur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transporteurs/{id}")
    public ResponseEntity<Void> deleteTransporteur(@PathVariable Long id) {
        log.debug("REST request to delete Transporteur : {}", id);
        transporteurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
